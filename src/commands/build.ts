import LibraryBuild from '../plugins/library-build';

export default function() {
  const build = new LibraryBuild();
  build.build();
}
