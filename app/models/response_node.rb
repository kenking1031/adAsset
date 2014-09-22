class ResponseNode
  # To change this template use File | Settings | File Templates.
  require 'rubygems'
  require 'json'
  attr_accessor :id, :attributes
  include Episode

  def initialize(node,bearer_token= nil)
    @id = node["id"].to_i
    @attributes = node
    @bearer_token = bearer_token
  end

  def description
    shorten_description(@attributes["description"],600)
  end

  def self.json_create(a, bearer_token= nil)

    if (a.class == String)
      new(JSON.parse(a),bearer_token) if a
    else
      new(a,bearer_token) if a
    end

  end

  def key
    "#{@id}"
  end

  def bearer_token

    @bearer_token

  end

  def image_default_url
    image_url(@attributes)
  end

  def method_missing(meth, *args, &blk)
    @attributes[meth.to_s] if @attributes.has_key?(meth.to_s)
  end

  # def respond_to?(method)
  #
  #   true if !@attributes[method].blank? || super
  #
  # end

  def text_last_update
    updatedTime
  end

  def title
    @attributes['title']
  end

  def to_json(*a)
    {
        "id" => @id,
        "attributes" => @attributes
    }.to_json(*a)
  end

  def to_param
    "#{key}-#{title}".parameterize
  end

  def total_items
    @attributes['totalItems'].to_i
  end

  def type
    @attributes['type']
  end

  def updatedTime

    if @attributes["lastUpdateTimestamp"] == "1900-01-01T00:00:00" || @attributes["lastUpdateTimestamp"] ==""
      "N/A"
    else
      last_update_as_text(@attributes["lastUpdateTimestamp"])
    end

  end

end