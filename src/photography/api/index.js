// @flow
import * as _ from "lodash";

const photos = require("./photos");

const albums = _.groupBy(photos, "album");

export type Photo = {
    id: string,
    album: string,
    created_at: string,
    location?: {
      title: string,
      name: string,
      city: string,
      country: string,
      position: {
        latitude: number,
        longitude: number
      }
    },
    urls: {
        full: string,
        regular: string,
        small: string,
        preview: string
    }
};

type Photography = {
    photos: Photo[],
    albums: { [name: string]: Photo[] },
    album: string => Photo[]
};

const api: Photography = {
    photos,
    albums,
    album: (album: string) => albums[album]
};

export default api;
