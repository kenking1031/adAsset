#
# Channel object as it is returned from middle tier
#
class ChannelResponseNode < ResponseNode

  def channel?

    @attributes['type'] == 'Channel'

  end


  def cleaned_shows

    no_of_shows > 0 ? shows.map{|show| to_clean_show_new(show)} : []

  end

  def cleaned_videos

    no_of_videos > 0 ? videos.map{|video| to_clean_episode_new(video)} : []

  end

  def no_of_shows

    total_items.to_i

  end

  def no_of_videos

    total_items.to_i

  end

  def publisher_id

    pid = @attributes['publisher'].nil? ? "" :  @attributes['publisher']['id'].to_i

    pid.eql?(0) ? nil : pid

  end

  def publisher_name

    @attributes['publisher'].nil? ? "N/A" : @attributes['publisher']['name']

  end

  def publisher_description

    @attributes['publisher'].nil? ? "" : @attributes['publisher']['description']

  end

  def publisher_url

    @attributes['publisher'].nil? ? "" :  "/publishers/" + "#{publisher_id} - #{publisher_name}".parameterize

  end

  def publisher_api

    @attributes["links"]["publisher"]

  end

  def url

    "/channels/#{to_param}"

  end

  def shows

    @attributes['items']

  end


  def shows_count

    @attributes["numOfShows"].nil? ? 0 : @attributes["numOfShows"].to_i

  end

  def videos_count

    @attributes['numOfVideos'].nil? ? 0 : @attributes["numOfVideos"].to_i

  end

  def videos

    @attributes['items']

  end

  def show?

    @attributes['type'] =='Show'

  end

  def channels

    @attributes['items']   #Todo move to genres or publishers or bundles response

  end

  def cleaned_channels

    channels.map{|channel| to_clean_channel_new(channel)}  #Todo move to genres or publishers or bundles response

  end

  def subtitle

    if shows_count > 0

      if shows_count > 1

        subtitle= "#{shows_count.to_s} Shows"

      else

        subtitle= "#{shows_count.to_s} Show"

      end

    elsif videos_count > 0

      if videos_count > 1

        subtitle = "#{videos_count.to_s} Episodes"

      else

        subtitle = "#{videos_count.to_s} Episode"

      end

    else

      subtitle = ""

    end

    subtitle

  end



end