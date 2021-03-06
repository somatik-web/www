const {ARTISTS, ALBUMS} = require('./artists-data');

const entries = (only = ['name', 'nickname', 'photo_url', 'info']) => (it) =>
  Object.entries(it).filter(([key]) => only.includes(key))
    .map(([key, value]) => `'${key}' => '${value}'`).join(`,\n`);

console.log(`createMany([
            ${ARTISTS.map((it) => `[${entries()(it)}]`).join(',\n')}
        ]);
`);

console.log(
  `createMany([
            ${ALBUMS.map((it) => `[${entries(['name', 'date', 'url', 'image'])(it)}]`).join(',\n')}
        ]);
`);

console.log(ALBUMS.map((it) => `('${it.name}',TIMESTAMP(STR_TO_DATE('${it.date ? it.date : '01.01.2016'}','%d.%m.%Y')),'${it.image}',${it.url ? `'${it.url}'` : 'DEFAULT'})`)
  .join(`,\n`));

console.log(ARTISTS.map((it) => `('${it.nickname}','${it.name}','${it.info}','${it.photo_url}')`)
  .join(`,\n`));

const eachArtist = (it) => {
  console.log(`$artist = Artist::resolve("${it.nickname}");`)
  Object.entries(it.social).forEach(([key, value]) => {
    console.log(`$artist->addSocialLink("${key}", "${value}");`)
  })
};

ARTISTS.forEach(eachArtist)

const resolveAlbum = (it) => {
  console.log(`$artist = Artist::resolve("${it.nickname}");`)
  for (const album of it.albums) {
    console.log(`$album = Album::resolve("${album.name}");`)
    console.log(`$artist->addAlbum($album);`)
  }
};

ARTISTS.forEach(resolveAlbum)

ALBUMS.forEach((it) => {
  console.log(`$album = Album::resolve("${it.name}");`);
  Object.entries(it.social || {}).forEach(([key, value]) => {
    console.log(`$album->addSocialLink("${key}", "${value}");`)
  });
});

