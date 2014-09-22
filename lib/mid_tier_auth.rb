module MidTierAuth
  # To change this template use File | Settings | File Templates.
  include HTTParty

  def get_midtier_token

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

    begin

        response = HTTParty.post(resource_path,options)

    rescue SocketError => e

        # response = EmptyResponse.new()

    end

    # Resque.enqueue(DelayedLogJob, :post, resource_path, options,response.parsed_response,response.code)

    token = response.headers.size ==0 ? "noresponse" : response.headers["sessiontoken"]

    token

  end


  def set_midTier_session
    $MidTierToken = get_midtier_token
  end

  def extract_remember_me(cookie_fields)
    if cookie_fields.present?
      cookie_fields.each do |f|
        if f =~ /rememberMe/ && f !~ /deleteMe/
          return extract_cookie_value(f)
        end
      end
    end
    ""
  end

  def extract_jsession(cookie_fields)
    if cookie_fields.present?
      cookie_fields.each do |f|
        if f =~ /JSESSIONID/
          return extract_cookie_value(f)
        end
      end
    end
    ""
  end
  def extract_sumo_session(cookie_fields)
    if cookie_fields.present?
      cookie_fields.each do |f|
        if f =~ /sumoSession/ && f !~ /deleteMe/
          return extract_cookie_value(f)
        end
      end
    end
    ""
  end

  def extract_cookie_value(cookie)
    value = ""
    if cookie.present?
      #value_1 = cookie.split(";")
      #value_2 = value_1.first if value_1.present?
      #value_3 = value_2.split("=") if value_2.present?
      #value = if value_3.present? then value_3.last else "" end
      value_1 = cookie.split(",")
      if value_1.size > 1
        value = cookie.split(',')[2].split('=')[1]
      else
        value = cookie.split("=")[1]
      end
    end
    value
  end


end
