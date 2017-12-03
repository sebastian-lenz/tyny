import { $, View, ViewOptions } from 'tyny';

import propertyTable from './utils/propertyTable';

class Movie {
  title: string;
  author: string;
  year: number;

  constructor(value: string) {
    const parts = value.split(',');
    this.title = parts[0];
    this.author = parts[1];
    this.year = parseInt(parts[2]);
  }
}

@$.component('.tynyCoreDataClass')
export default class DataClass extends View {
  @$.data({ type: 'class', ctor: Movie })
  movie: Movie;

  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = propertyTable(this.movie, [
      'title',
      'author',
      'year',
    ]);
  }
}
