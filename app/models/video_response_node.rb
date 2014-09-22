#
# Video object as it is returned from middle tier
#
class VideoResponseNode  < ResponseNode
  # To change this template use File | Settings | File Templates. attr_accessor :id, :category_id, :channel_id, :attributes


  def channelId

    @attributes['channelId'].to_i

  end

  def playList

    @attributes['items']

  end

  def no_of_videos
    @attributes['totalItems']
  end

  def total_playList_items
    no_of_videos
  end

  def duration

    @attributes['duration'].to_i

  end

  def position
    @attributes['progressPosition'].to_i
  end

  def status
    position.nil? ? 0: position.to_f/1000/duration.to_f
  end

  def image_default_url

    image_url(@attributes,'videos')

  end


  def cleaned_videos

    no_of_videos > 0 ? playList.map{|video| to_clean_episode_new(video)} : []

  end

  def image_player_url

    @attributes["links"]["template-image"].gsub('{width}','1280').gsub('{height}','720')

  end

  def like_count

    @attributes["voteCount"].to_i

  end

  def live_broad_cast_time

    @attributes['liveBroadcastTime']

  end


  # def method_missing(meth, *args, &blk)
  #
  #   if @attributes.has_key?(meth.to_s)
  #
  #     @attributes[meth.to_s]
  #
  #   else
  #     k2 = meth.to_s.camelize(:lower)
  #
  #     if @attributes.has_key?(k2)
  #
  #       @attributes[k2]
  #
  #     else
  #       pp @attributes
  #
  #     end
  #   end
  #
  # end


  def parental_guidance

    attributes['parentalGuidance']

  end


  def showId

    @attributes["showId"].nil? ?  nil : @attributes["showId"].to_i

  end

  def url

    "/videos/#{to_param}"

  end

  def contentURL

    @attributes["playbackItems"].nil? ? nil : @attributes["playbackItems"][0]["uri"]

  end

  def mediaFormat

    @attributes["playbackItems"].nil? ? nil : @attributes["playbackItems"][0]["mediaFormat"]

  end

  def bitRate

    @attributes["playbackItems"].nil? ? nil : @attributes["playbackItems"][0]["bitRate"]

  end

  def logURI

    @attributes["playbackItems"].nil? ? nil : @attributes["playbackItems"][0]["logUri"]

  end

  def logData

    @attributes["logData"]

  end

  def description_short

    @attributes['shortDescription'].nil? ? " " : @attributes['shortDescription']

  end

  def description

    @attributes['longDescription'].nil? ? " " :  @attributes['longDescription']

  end

  def isShow?

    !(@attributes['links']['show'].nil?)

  end

  def show_api

    @attributes["links"]["show"]

  end

  def channel_api

    @attributes["links"]["channel"]

  end

end