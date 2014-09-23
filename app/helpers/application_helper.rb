module ApplicationHelper

  def time_to_number(timeStr)

    Time.new(timeStr).to_i
  end

end
