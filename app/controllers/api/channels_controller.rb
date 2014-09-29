class Api::ChannelsController < ApplicationController

  def assets

    size = params[:size].to_i

    @message = "Watchable Ad Assets"

    @channel_videos = Finder.find($MidTierToken, nil, nil, nil, "channels", nil, nil, nil, nil, size, nil, "/api/web/admin/search/channels/"+SiteConfig.CHANNEL_ID+"/videos")[0]

    @data = []

    @channel_videos.items.each do |video|

      # videoDetail = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/videos/"+video['id'])[0]
      # title = videoDetail.title
      # created_time = videoDetail.live_broad_cast_time
      thumbnail = video['links']['cell-image']
      title = video['title']
      created_time = video['liveBroadcastTime']

      playbackItem = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/videos/"+video['id']+"/playbackuri?videoFormat=MP4")[0]
      if playbackItem.contentURL.blank?
        play_url = "error"
      else
        play_url = playbackItem.contentURL
      end

      @data << {"thumbnail" => thumbnail, "title" => title, "created_time" => created_time, "play_url" => play_url}

    end

    result={:assets => @data, :size => size, :message => @message , :channelId => SiteConfig.CHANNEL_ID, :total_assets => @channel_videos.no_of_videos }

    render json: result, status: :ok

  end

end