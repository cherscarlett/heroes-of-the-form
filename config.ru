use Rack::Static, 
  :urls => ["/images", "/javascripts", "/stylesheets", "/fonts", "/audio"],
  :root => "public"

app = lambda { |env|
  path = env['PATH_INFO']
  body = File.open('public' + path + '/index.html', File::RDONLY).read
  return [
    200, {
        'Content-Type'  => 'text/html', 
        'Cache-Control' => 'public, max-age=86400' 
      }, [body]
  ]
}

map "/" do
    run app
end
