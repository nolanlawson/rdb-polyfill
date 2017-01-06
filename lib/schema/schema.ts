/**
 * @license
 * Copyright 2016 The Lovefield Project Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IDatabaseSchema} from '../spec/database_schema';
import {ITable, Table} from '../spec/table';
import {TableSchema} from './table_schema';

export class Schema implements IDatabaseSchema {
  readonly name: string;
  readonly version: number;
  public tables: Map<string, TableSchema>;

  constructor(name: string, version: number) {
    this.name = name;
    this.version = version;
    this.tables = new Map<string, TableSchema>();
  }

  public table(name: string): Table {
    return this.tables.get(name) as ITable as Table;
  }
}
