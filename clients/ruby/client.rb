this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'date'
require 'virtru_services_pb'

def main
  server_url = '0.0.0.0:50051'
  client = Virtru::Virtru::Stub.new(server_url, :this_channel_is_insecure)
  begin
    currentTimestamp = DateTime.now().strftime("%a, %d %b %Y")
    protectedString = client.encrypt(Virtru::EncryptRequest.new(unprotectedString: currentTimestamp)).protectedString
    p protectedString
    unprotectedString = client.decrypt(Virtru::DecryptRequest.new(protectedString: protectedString)).unprotectedString
    p unprotectedString
  rescue GRPC::BadStatus => e
    abort "ERROR: #{e.message}"
  end
end

main
