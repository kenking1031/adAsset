module Episode

  require 'net/http'

  def clean_upNext_asset(asset)

    episode_no = (asset["episode"].blank? || asset["episode"].to_s=="0")? "":"Episode #{asset["episode"]}"
    season_no = (asset["season"].blank? || asset["season"].to_s=="0")? "":" - Season #{asset["season"]}"
    status = asset["progressPosition"].blank?? 0: asset["progressPosition"].to_f/1000/asset["duration"].to_f
    url ="/videos/#{make_url(asset)}"

    {
        "id" => asset['id'],
        "image_url" =>image_url(asset),
        "title" => asset["title"],
        "status" => status,
        "url" => url,
        "subtitle" =>"#{episode_no}#{season_no}"
    }.delete_if{|key,value| value.blank?}


  end

  def to_clean_episode(episode)


    season_no=episode.attributes["metadata"]["season"].blank?? "":" - Season #{episode.attributes["metadata"]["season"].flatten.last.to_i}"


    if episode.episode.class!=Hash     #Identify if a video is under channel directly or under shows of the channel
      episode_no=episode.episode.blank?? "":"Episode #{episode.episode.to_i}"
    else
      episode_no=""
    end

    image_url="#{SiteConfig.IMAGES_URL}/api/v2/img/#{episode.attributes['image-pack']}?location=video-cell-web&width=222&height=125"

    if episode.attributes['image-pack'].blank?
      image_url="#"
    end

    url=episode.attributes['title'].blank?? "":"/videos/#{episode.to_param}"
    {
        "id"=>episode.id,
        "image_pack_id"=>episode.attributes["image-pack"],
        "image_url"=>image_url,
        "title"=>episode.attributes["title"],

        "url"=>url,
        "subtitle"=>"#{episode_no}#{season_no}"
    }.delete_if{|key,value| value.blank?}


  end


  def to_clean_episode_search(episode)
    Rails.logger.info "episode # cleanshow: #{episode}"
    episode_no = (episode.respond_to?('episode') && episode.episode.to_s!="0")? "Episode #{episode.episode}" : ""
    season_no = (episode.respond_to?('season') && episode.season.to_s!="0")? " - Season #{episode.season}" : ""
    image_url=episode.links['logo-image']


    url=episode.respond_to?('title')? "/videos/#{episode.to_param}" : ""
    {
        "id"=>episode.key,
        "image_pack_id"=>nil,
        "image_url"=>image_url,
        "title"=>episode.title,
        "url"=>url,
        "subtitle"=>"#{episode_no} #{season_no}"
    }.delete_if{|key,value| value.blank?}


  end


  def to_clean_episode_new(episode)

    season_no = (episode["season"].blank? || episode["season"].to_s=="0") ? "" :" - Season #{episode["season"]}"

    #
    #if episode.episode.class!=Hash     #Identify if a video is under channel directly or under shows of the channel
    #  episode_no=episode.episode.blank?? "":"Episode #{episode.episode.to_i}"
    #else
    #  episode_no=""
    #end

    episode_no = (episode["episode"].blank? || episode["episode"].to_s=="0") ? "" : "Episode #{episode["episode"]}"

    #image_url = episode["link"][1]["uri"]
    url = "/videos/#{make_url(episode)}"

    {
        #"id"=>episode.id,
        #"image_pack_id"=>episode.attributes["image-pack"],
        #"title"=>episode.attributes["title"],
        "id" => episode["id"],
        "title" => episode["title"],
        "image_url"=>image_url(episode,'episode'),
        "url"=>url,
        "subtitle"=>"#{episode_no}#{season_no}"
    }.delete_if{|key,value| value.blank?}
  end

  def to_clean_channel(channel)


    url=channel.attributes['title'].blank?? "":"/channels/#{channel.to_param}"

    title= channel.attributes["title"].blank?? "":channel.attributes["title"]


    {
        "id"=>channel.id,
        "image_pack_id"=>channel.attributes["image-pack"],
        "image_url"=>"#{SiteConfig.IMAGES_URL}/api/v2/img/#{channel.attributes['image-pack']}?location=channel-cell-web&width=105&height=125",
        "title"=>title,
        "subtitle"=>channel.subtitle,
        "url"=>url
    }.delete_if{|key,value| value.blank?}


  end


  def to_clean_channel_search(channel)

    Rails.logger.info "channel # cleanchannel: #{channel}"
    url = channel.url

    title= (channel.respond_to?('title'))? channel.title : ""


    {
        "id"=>channel.key,
        "image_pack_id"=>nil,
        "image_url"=>channel.image_default_url,
        "title"=>channel.title,
        "subtitle"=>channel.subtitle,
        "url"=>url
    }.delete_if{|key,value| value.blank?}


  end



  def to_clean_channel_new(channel)

    url = "/channels/#{make_url(channel)}"

    if channel['numOfShows'].to_i>1
      subtitle = "#{channel['numOfShows']} Shows"
    elsif channel['numOfShows'].to_i==1
      subtitle = "#{channel['numOfShows']} Show"
    elsif channel['numOfVideos'].to_i>1
      subtitle = "#{channel['numOfVideos']} Episodes"
    elsif channel['numOfVideos'].to_i==1
      subtitle = "#{channel['numOfVideos']} Episode"
    else
      subtitle = ""
    end

    {
        "id" => channel["id"],
        "title" => channel["title"],
        "image_url"=>image_url(channel),
        "url"=>url,
        "subtitle"=>subtitle
    }.delete_if{|key,value| value.blank?}

  end

  def to_clean_show(show)



    url=show.attributes['title'].blank?? "":"/shows/#{show.to_param}"

    {
        "id"=>show.id,
        "image_pack_id"=>show.attributes["image-pack"],
        "image_url"=>"#{SiteConfig.IMAGES_URL}/api/v2/img/#{show.attributes['image-pack']}?location=show-cell-web&width=222&height=125",
        "title"=>show.attributes["title"],
        "subtitle"=>show.subtitle,
        "url"=>url
    }.delete_if{|key,value| value.blank?}

  end



  def to_clean_show_search(show)

    Rails.logger.info "show # cleanshow: #{show}"
    {
        "id"=>show.key,
        "image_pack_id"=>nil,
        "image_url"=>show.image_default_url,
        "title"=>show.title,
        "subtitle"=>show.subtitle,
        "url"=>show.url
    }.delete_if{|key,value| value.blank?}

  end

  def to_clean_show_new(show)

    url = "/shows/#{make_url(show)}"

    if show['numOfVideos'].to_i>1
      subtitle = "#{show['numOfVideos']} Episodes"
    elsif show['numOfVideos'].to_i==1
      subtitle = "#{show['numOfVideos']} Episode"
    else
      subtitle = ""
    end

    {
        "id" => show["id"],
        "title" => show["title"],
        "image_url"=>image_url(show,'show'),
        "url"=>url,
        "subtitle"=>subtitle
    }.delete_if{|key,value| value.blank?}

  end

  def format_duration(duration)

    t = duration.to_i
    h = t/3600
    s = t%3600
    m = s/60
    s = s%60
    # pad the minute and second strings to two digits
    if s.to_s.length<2
      s = "0" + s.to_s
    end
    if h>0
      if m.to_s.length<2
        m = "0" + m.to_s
      end
      h.to_s + ":" + m.to_s + ":" + s.to_s
    else
      m.to_s + ":" + s.to_s
    end

  end

  def get_likes_count(assetId)
    likes = 0
    response = Vac::Request.get("/web/asset/#{assetId}/ratingscount").parsed_response

    if response["properties"]["property"]
      if response["properties"]["property"].class == Array
        response["properties"]["property"].each do |property|
          if property["property"] == "RATING_COUNT_5"
            likes = property["value"]
          end
        end
      elsif response["properties"]["property"].class == Hash
        if response["properties"]["property"]["property"] == "RATING_COUNT_5"
          likes = response["properties"]["property"]["value"]
        end
      end
    end

    return likes
  end

  def check_likedId(assetId,userId)

    likedId = 0


    begin
      response = Vac::Request.get("/web/asset/#{assetId}/ratings").parsed_response
    rescue
      #raise SystemCallError "Service is not available"
      likedId = 0
    end


    if response["ratings"]["rating"]
      if response["ratings"]["rating"].class == Array
        response["ratings"]["rating"].each do |rating|
          if rating["user_id"] == userId.to_s and rating["rating"] == "RATING_5"
            likedId = rating["id"].to_i
            return likedId
          end
        end
      elsif response["ratings"]["rating"].class == Hash
        if response["ratings"]["rating"]["user_id"] == userId.to_s and response["ratings"]["rating"]["rating"] == "RATING_5"
          likedId = response["ratings"]["rating"]["id"].to_i
          return likedId
        end
      end
    end

    likedId
  end

  #def remote_file_exists?(url)
  #  url = URI.parse(url)
  #  Net::HTTP.start(url.host, url.port) do |http|
  #
  #      return http.head(url.request_uri)['Content-Type'].start_with? 'image'
  #
  #  end
  #end

  def shorten_description(description,text_length)
    description.length>text_length ? description.slice(0,text_length)+"..." : description
  end

  def make_url(episode)

    "#{episode['id']}-#{episode['title']}".parameterize

  end

  def last_update_as_text(timestamp)

    date = DateTime.parse(timestamp)

    # calculate how long ago content was updated
    seconds=(Time.new-date).to_i
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24
    weeks = days / 7
    months = weeks / 4

    # return the number of days as user-friendly text using the locale of user
    if(months>1)
      return last_update_string = I18n.t('channel.updated.months_ago', :value => months)
    elsif(months == 1)
      return last_update_string = I18n.t('channel.updated.month_ago')
    elsif(weeks>1)
      return last_update_string = I18n.t('channel.updated.weeks_ago', :value => weeks)
    elsif(weeks == 1)
      return last_update_string = I18n.t('channel.updated.week_ago')
    elsif(days>1)
      return last_update_string = I18n.t('channel.updated.days_ago', :value => days)
    elsif(days == 1)
      return last_update_string = I18n.t('channel.updated.day_ago')
    elsif hours > 1
      return last_update_string = I18n.t('channel.updated.hours_ago', :value => hours)
    elsif minutes > 2
      return last_update_string = I18n.t('channel.updated.minutes_ago', :value => minutes)
    else
      return last_update_string = I18n.t('channel.updated.now')
    end

  end

  def image_url(item,type={})

     if item["links"]["logo-image"]=~ /\{imagePack\}/

       'http://vcc.stage.xidio.com/static_assets/question-mark.jpg'
     else

       if type.nil?

          item["links"]["logo-image"]

       else

         item["links"]["cell-image"]

       end

     end

  end


end
