class HomeController < ApplicationController

  def index

    @message = "Welcome to Watchable Ad Assets Page"

    @channel_videos = Finder.find($MidTierToken, nil, nil, nil, "channels", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/channels/"+SiteConfig.CHANNEL_ID+"/videos")[0]

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

    @data

  end

end