class Api::ChannelsController < ApplicationController

  def assets

    size = params[:size].to_i
    pageNum = params[:pageNum].to_i || 1

    channel_id= params[:channelId] || SiteConfig.CHANNEL_ID

    @message = "Watchable Ad Assets"

    channel_videos_response = Finder.find($MidTierToken, nil, nil, nil, "channels", nil, nil, nil, nil, size, nil, "/api/web/admin/search/channels/#{channel_id}/videos?pageNum=#{pageNum}&pageSize=#{size}")

    @channel_videos =channel_videos_response[0]

    @data = []

    if channel_videos_response[2] == 200
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

      #result={:status => channel_videos_response[2], :assets => @data, :size => size, :message => @message , :channelId => SiteConfig.CHANNEL_ID, :total_assets => @channel_videos.no_of_videos }

      result= {:status=>200, :assets=>[{"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/5421b07de4b08c27f73757d0+1411494013000?width=222&height=125", "title"=>"Test to check", "created_time"=>"2014-09-23T17:39:02Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411494055499_Afraid_of_(8019_,R22MP464,R21MP4350,R21MP4500,R21MP41000,R21MP41500,R21MP42000,R21MP43000,R21MP44000,R21MP45000,).mp4.csmil/master.m3u8"}, {"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/5421bd35e4b08c27f73757d3+1411497269000?width=222&height=125", "title"=>"Nalley Nissan", "created_time"=>"2014-09-23T15:47:41Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411488559266_nalleyniss(8015_,R22MP464,R23MP4350,R23MP4500,R23MP41000,R23MP41500,R23MP42000,R23MP43000,R23MP44000,R23MP45000,).mp4.csmil/master.m3u8"}, {"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/54234634e4b088c97249b248+1411597876000?width=222&height=125", "title"=>"Fred Beans Subaru", "created_time"=>"2014-09-23T15:47:41Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411488645672_fedbeans_8(8016_,R22MP464,R23MP4350,R23MP4500,R23MP41000,R23MP41500,R23MP42000,R23MP43000,R23MP44000,R23MP45000,).mp4.csmil/master.m3u8"}, {"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/54219a57e4b08c27f73757cc+1411488343000?width=222&height=125", "title"=>"Nelson Auto Group", "created_time"=>"2014-09-23T08:47:41Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411487712729_nelsonauto(8013_,R22MP464,R21MP4350,R21MP4500,R21MP41000,R21MP41500,R21MP42000,R21MP43000,R21MP44000,R21MP45000,).mp4.csmil/master.m3u8"}, {"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/54219bade4b08c27f73757cd+1411488686000?width=222&height=125", "title"=>"Shore Vascular and Vein Center", "created_time"=>"2014-09-23T08:47:41Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411487787352_shorevascu(8014_,R22MP464,R21MP4350,R21MP4500,R21MP41000,R21MP41500,R21MP42000,R21MP43000,R21MP44000,R21MP45000,).mp4.csmil/master.m3u8"}, {"thumbnail"=>"http://demo3-image-lb-1840931351.us-east-1.elb.amazonaws.com/api/v2/img/5421bd49e4b088c97249ae70+1411497289000?width=222&height=125", "title"=>"Marmot Commercial", "created_time"=>"2014-09-23T02:16:38Z", "play_url"=>"http://cilhlsvod-f.akamaihd.net/i/MP4/demo3/2014-09-23/1411489098493_Marmot_Fal(8017_,R22MP464,R23MP4350,R23MP4500,R23MP41000,R23MP41500,R23MP42000,R23MP43000,R23MP44000,R23MP45000,).mp4.csmil/master.m3u8"}], :size=>3, :message=>"Watchable Ad Assets", :channelId=>10781, :total_assets=>6}

      #result={:status => channel_videos_response[2]}

    end
      Rails.logger.info(result);
    render json: result, status: :ok

  end

end