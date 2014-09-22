class HomeController < ApplicationController

  def index

    @message = "Welcome to Watchable Ads Asset page"

    @channel = Finder.find($MidTierToken,SiteConfig.CHANNEL_ID,nil,nil,'channels')[0]

    @channel_videos = Finder.find($MidTierToken,SiteConfig.CHANNEL_ID,nil,nil,'channels','allvideos',nil,nil,1,1000)[0]

    @data = []

    # @channel_videos.cleaned_videos.each do |video|
    @channel_videos.items.each do |video|

      # videoDetail = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/videos/"+video['id'])[0]
      # title = videoDetail.title
      # created_time = videoDetail.live_broad_cast_time
      title = video['title']
      created_time = video['liveBroadcastTime']

      playbackItem = Finder.find($MidTierToken, nil, nil, nil, "videos", nil, nil, nil, nil, nil, nil, "/api/web/admin/search/videos/"+video['id']+"/playbackuri?videoFormat=MP4")[0]
      if playbackItem.contentURL.blank?
        play_url = "error"
      else
        play_url = playbackItem.contentURL
      end

      @data << {"title" => title, "created_time" => created_time, "play_url" => play_url}

    end

    @data

  end

end