this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'virtru_services_pb'

def main
  hostname = 'localhost:50051'
  stub = Virtru::Virtru::Stub.new(hostname, :this_channel_is_insecure)
  begin
    protectedString = stub.encrypt(Virtru::EncryptRequest.new(unprotectedString: 'hello world')).protectedString
    p protectedString
    unprotectedString = stub.decrypt(Virtru::DecryptRequest.new(protectedString: protectedString)).unprotectedString
    p unprotectedString
  rescue GRPC::BadStatus => e
    abort "ERROR: #{e.message}"
  end
end

main
