class Stuff
  attr_accessor :a, :b

  def initialize opts
    @a = opts[:a]
    @b = opts[:b]
  end

  def compute
    @a += @b
  end

end

a = Stuff.new({:a => 32, :b => 43})
puts "#{a.a} <=> #{a.b}"
a.compute
puts "#{a.a} <=> #{a.b}"
a.compute
puts "#{a.a} <=> #{a.b}"