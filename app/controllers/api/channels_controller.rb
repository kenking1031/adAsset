class Api::ChannelsController < ApplicationController

  def assets

    size = params[:size].to_i
    pageNum = params[:pageNum].to_i || 1

    @message = "Watchable Ad Assets"

    channel_videos_response = Finder.find($MidTierToken, nil, nil, nil, "channels", nil, nil, nil, nil, size, nil, "/api/web/admin/search/channels/#{SiteConfig.CHANNEL_ID}/videos?pageNum=#{pageNum}&pageSize=#{size}")

    @channel_videos =channel_videos_response[0]

    @data = []

    if channel_videos_response[2] ==200
      @channel_videos.items.each do |video|

        # videoDetail = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/videos/"+video['id'])[0]
        # title = videoDetail.title
        # created_time = videoDetail.live_broad_cast_time
        thumbnail = video['links']['cell-image']
        title = video['title']
        created_time = video['liveBroadcastTime']

        playbackItem = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/videos/#{video['id']}/playbackuri?videoFormat=MP4")[0]
        if playbackItem.contentURL.blank?
          play_url = "error"
        else
          play_url = playbackItem.contentURL
        end

        @data << {"thumbnail" => thumbnail, "title" => title, "created_time" => created_time, "play_url" => play_url}

      end

      result={:status => channel_videos_response[2], :assets => @data, :size => size, :message => @message , :channelId => SiteConfig.CHANNEL_ID, :total_assets => @channel_videos.no_of_videos }
    else

      result={:status => channel_videos_response[2]}

    end
      Rails.logger.info(result);
    render json: result, status: :ok

  end

end