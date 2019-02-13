
export default function(api) {
  api.register('modifyLibrarySubCommandHandler', ({ memo }) => {
    memo['foo'] = function() {
      console.log('bar');
    };
    return memo;
  });
}
