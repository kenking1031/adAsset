class ApplicationController < ActionController::Base
  protect_from_forgery

  include MidTierAuth

  before_filter :initial_midTier


  def midTierToken?
    !$MidTierToken.blank?
  end

  def initial_midTier
    if !midTierToken?
      set_midTier_session
    end
  end

end
