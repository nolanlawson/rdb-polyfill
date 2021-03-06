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

import {IExecutionContext, TransactionResults} from '../spec/execution_context';
import {NativeDB} from './native_db';
import {QueryBase} from './query_base';
import {SqlConnection} from './sql_connection';

export class SqlExecutionContext implements IExecutionContext {
  private connection: SqlConnection;
  private db: NativeDB;
  private sqls: string[];
  private finalized: boolean;
  private toNotify: QueryBase[];

  constructor(connection: SqlConnection, implicit = true) {
    this.connection = connection;
    this.db = implicit ? connection.getImplicitContext() : null;
    this.sqls = [];
    this.finalized = false;
    this.toNotify = [];
  }

  public get active(): boolean {
    return !this.finalized;
  }

  private checkState(): void {
    if (this.finalized) {
      throw new Error('TransactionState');
    }
  }

  public prepare(sql: string): void {
    this.checkState();
    this.sqls.push(sql);
  }

  public commit(): Promise<TransactionResults> {
    this.checkState();
    this.finalized = true;
    return this.db.run(this.sqls).then((ret: TransactionResults) => {
      this.toNotify.forEach(q => q.onCommit(this.connection));
      return ret;
    });
  }

  public rollback(): Promise<void> {
    this.checkState();
    this.finalized = true;
    return this.db.exec('rollback');
  }

  public inspect(): string[] {
    return this.sqls;
  }

  public associate(query: QueryBase): SqlExecutionContext {
    if (query.postCommitCallback) {
      this.toNotify.push(query);
    }
    return this;
  }
}
