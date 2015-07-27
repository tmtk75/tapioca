export default {
  ex0: `\
@found "You", ->
  @message "Think", ->
    @message "Write your idea", "JUMLY", ->
      @create "Diagram"`,

  ex1: `\
@found "User", ->
  @message "search", "Browser", ->
    @create asynchronous:"connection", "Web Server"
    @message "GET", "Web Server", ->
      @message "find the resource", -> @reply ""
    @reply "", "User"`,

  ex2: `\
@found "You", ->
  @alt
    "[found]": ->
      @loop ->
        @message "request", "HTTP Server"
        @note "NOTE: This doesn't make sense :) just an example"
    "[missing]": ->
      @message "new", "HTTP Session"
  @ref "respond resource"`,

  ex3: `\
@found "Browser", ->
  @message "http request", "HTTP Server", ->
    @create "HTTP Session", ->
      @message "init"
      @message "aquire lock", "Database"
    @message "do something"
    @message "release lock", "Database"
    @reply "", "Browser"`,

  ex4: `\
@found "Client", ->

  @message "ClientHello", "Server", ->
    @note "Hi! I'm a client, let's talk in SSL."
    @message "ServerHello", "Client", ->
    @message "Certificate", "Client", ->
    @message "ServerKeyExchange", "Client", ->
    @message "ServerHelloDone", "Client", ->

  @message "ClientKeyExchange", "Server", ->
  @message "[ChangeCipherSpec]", "Server", ->
  @message "Finished", "Server", ->
    @message "Finished", "Client"

client.css "margin-right":"140px"`,

}
