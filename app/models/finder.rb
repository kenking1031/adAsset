class Finder

  @@tries = 1

  def self.find(token,id= nil,bear_token= nil,cookie=nil, source_type= nil, item_type= nil,second_id= nil, second_item_type= nil, pageNum= nil, pageSize= nil, isLogged= nil, api_path= nil)

    resource_path = resource_path(id,source_type,item_type,second_id, second_item_type, pageNum, pageSize, api_path)

    Rails.logger.info "Resource_path : #{resource_path}"
    options = options(token, bear_token, cookie)

    begin

      response = HTTParty.get(resource_path,options)

    rescue SocketError => e

      # response = EmptyResponse.new()

    end

    parsed_response= response.parsed_response

    # Resque.enqueue(DelayedLogJob, :get, resource_path, options, parsed_response, response.code)

     if (response.code == 401 || response.code == 404 || response.code == 500 || response.code == 400) && @@tries < 6

      @@tries += 1

      $MidTierToken = get_midtier_token
      options = options($MidTierToken,bear_token,cookie)

      # if isLogged
      #
      #   user_instance = Finder.find($MidTierToken,nil,"Bearer c0cc2557-70ae-49b3-b01d-896db336d471",cookie,'users','profile')
      #
      #   user_profile = user_instance[0]
      #   if user_instance[2]== 200
      #     bearer_token = user_profile.bearer_token
      #   else
      #     bearer_token = bear_token
      #   end
      #
      #   resource_path = resource_path(id,source_type,item_type,second_id, second_item_type, pageNum, pageSize, api_path)
      #   options = options($MidTierToken,bearer_token,cookie)
      #
      # end

      begin

        response = HTTParty.get(resource_path,options)

      rescue SocketError => e

        # response = EmptyResponse.new()

      end

      response = HTTParty.post(resource_path,options)

      # Resque.enqueue(DelayedLogJob, :get, resource_path, options,response.parsed_response,response.code)

     elsif response.code == 200

       @@tries = 1

     end

     if response.headers.size > 0

        bearer_token = response.headers.get_fields('Authorization').nil? ? nil : response.headers.get_fields('Authorization')[0]

     end

      begin

        response = HTTParty.get(resource_path,options)

      rescue SocketError => e

        # response = EmptyResponse.new()

      end

    parsed_response = response.parsed_response

    response_code = response.code

    json_data = parsed_response

    data = nil
    data = model_name(source_type, item_type, id, second_id, second_item_type).json_create(json_data,bearer_token)  if response_code == 200

    log_msg = log_response(source_type, item_type, id, second_id)

    Rails.logger.info "log_msg: #{log_msg}"  unless data

    [data,parsed_response,response_code]

  end

  def self.resource_path(id= nil, source_type= nil, item_type= nil,second_id= nil, second_item_type= nil, pageNum= nil, pageSize= nil, api_path= nil)

    if api_path.nil?
      if source_type == 'curated'

        "#{SiteConfig.XTIER_URL}/web/curated/#{item_type}"

      elsif source_type == 'channels'|| source_type == 'shows' || source_type == 'videos'

        if item_type.nil?
          "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}"
        else
          "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}/#{item_type}?pageNum=#{pageNum}&pageSize=#{pageSize}"
        end

      elsif source_type == 'publishers'
        if item_type.nil?

          "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}"

        else
          if second_item_type.nil?
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}/#{item_type}?pageNum=#{pageNum}&pageSize=#{pageSize}"

          else
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}/#{item_type}/#{second_id}/#{second_item_type}?pageNum=#{pageNum}&pageSize=#{pageSize}"

          end
        end

      elsif source_type == 'genres'
        if id.nil?
          "#{SiteConfig.XTIER_URL}/web/#{source_type}"
        else
          if item_type.nil?
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}"
          elsif item_type == 'popular-channels-and-shows'
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}/#{item_type}"
          else
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{id}/#{item_type}?pageNum=#{pageNum}&pageSize=#{pageSize}"
          end
        end

      elsif source_type == 'users'
        if item_type == 'upnextlist'

          if id.nil?
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}/homepage"

          else
            "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}/videos/#{id}"
          end

        else

          if second_id.nil?
            if id.nil?
              "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}"
            else

              "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}/#{id}"
            end

          else
            if second_item_type.nil?
              "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}/#{second_id}"
            else
              "#{SiteConfig.XTIER_URL}/web/#{source_type}/#{item_type}/#{second_id}/#{second_item_type}?pageNum=#{pageNum}&pageSize=#{pageSize}"

            end

          end

        end

      elsif source_type == 'video-flags'

        "#{SiteConfig.XTIER_URL}/web/#{source_type}"

      end
    else
      "#{SiteConfig.XTIER_URL}".gsub("/api","") + "#{api_path}"
    end



  end

  def self.options(token, bear_token,cookie)


      {
          :headers => {
              'Accept' => 'application/json',
              'SessionToken' => token,
              'Authorization' => bear_token,
              'Vimond-Cookie' => cookie

          }.delete_if{|key,value| value.blank?}
      }


  end


  def self.log_response(source_type, item_type= nil, id= nil, second_id= nil, second_item_type= nil)
      if id.nil?
        if item_type.nil?
          "#{source_type.capitalize}Finder.find>Could not locate resource"
        else
          if source_type == 'popular'
            "#{source_type.capitalize}#{item_type.capitalize}Finder.find>Could not locate resource"
          elsif source_type == 'featured'

            "#{source_type.capitalize}Finder.find>Could not locate resource"
          end

        end

      else
        if item_type.nil?
          "#{source_type.capitalize}Finder.find>Could not locate #{source_type}_id=#{id}"
        else
          "#{source_type.capitalize}#{item_type.capitalize}Finder.find>Could not locate #{source_type}_id=#{id}"
        end

      end

  end

  def self.response_model(source_type, item_type= nil, id= nil, second_id= nil, second_item_type= nil)

    source_type = source_type.singularize

    if source_type == "video-flag"

      source_type = 'user'

    end


    prefix =  "#{source_type.capitalize}" + "ResponseNode"


    prefix.constantize

  end

  def self.model_name(source_type, item_type= nil, id= nil,second_id= nil, second_item_type= nil)

      response_model(source_type, item_type, id, second_id, second_item_type)

  end

  def self.get_midtier_token

    #secretKey = "WVy//GX8mK8JOW3maVacV4DewuActf5op+nreBufkFo="
    #salt = "354K-M947-U9528="
    #cipher = OpenSSL::Cipher::AES.new(256, :CBC)
    #cipher.encrypt
    #cipher.key =  Base64.decode64(secretKey)
    #cipher.iv = salt
    #
    #encrypted = cipher.update(sharedUuid) + cipher.final
    sharedUuid = "9a5901f0-63f9-4938-87cc-7a9b733788c1_3a5a0a7f-3e23-4fb2-9e16-4df426cf2190"
    resource_path ="#{SiteConfig.XTIER_URL}/web/authenticate"
    options = {
        :headers => { 'Content-Type' => 'text/plain' },

        #:body => Base64.encode64(encrypted).chop Todo use this when https implemented

        :body => sharedUuid
    }

    response = HTTParty.post(resource_path,options)

    token = response.headers.size == 0 ? "noresponse" : response.headers["sessiontoken"]

    token

  end


end