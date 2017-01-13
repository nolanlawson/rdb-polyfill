/**
 * @license
 * Copyright 2017 The Lovefield Project Authors. All Rights Reserved.
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

// import * as chai from 'chai';
import {SqlConnection} from '../../lib/proc/sql_connection';
import {SqlDatabase} from '../../lib/proc/sql_database';

// const assert = chai.assert;

describe('SqlDatabase', () => {
  it('should connect', () => {
    let db = new SqlDatabase('out');
    db.open('foo', {storageType: 'temporary'}).then(conn => {
      let nativeDb = (conn as SqlConnection).getImplicitContext();
      conn.createTable('foo')
          .column('blob', 'blob')
          .column('boolean', 'boolean')
          .column('date', 'date')
          .column('number', 'number')
          .column('string', 'string')
          .column('object', 'object')
          .commit().then(() => {
        return nativeDb.get('select * from sqlite_master');
      }).then(rows => {
        console.log(rows);
      });
    });
  });
});