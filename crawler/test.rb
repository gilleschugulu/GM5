class Stuff

  def initialize opts
    @a = opts.a
    @b = opts.b
  end

  def compute
    @a += @b
  end

end

a = new Stuff({a: 32, b: 43})
puts "#{a.a} <=> #{{a.b}}"
a.compute
puts "#{a.a} <=> #{{a.b}}"