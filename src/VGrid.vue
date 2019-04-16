<template>
  <div class="grid">
    <table class="grid-container max-width">
      <thead>
        <tr>
          <th v-for="column in visibleColumns"
              v-bind:class="column.class"
              v-bind:key="column.data">
            {{column.title || column.data}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-bind:key="index"
          v-bind:class="row.class" v-for="(row, index) in rows">
          <template v-for="column in visibleColumns">
            <td v-if="column.command"
              align="center"
              v-bind:class="column.class"
              v-bind:key="column.data">
              <input
                type="button"
                class="btn btn-text-center btn-danger"
                v-bind:value="column.text || 'DELETE'"
                v-if="column.command === 'delete'"
                v-on:click="deleteRow(row.data)" />
            </td>
            <td v-else
              v-bind:class="column.class"
              v-bind:key="column.data"
              v-html="renderColumn(column, row.data)"></td>
          </template>
        </tr>
        <tr v-if="rows.length === 0">
          <td align="center" :colspan="visibleColumns.length">No data available</td>
        </tr>
      </tbody>
      <tfoot></tfoot>
    </table>
    <div class="grid-pagination">
      <input class="btn btn-sm" type="button" value="Back"
        v-bind:disabled="!hasPrevPage"
        v-on:click="prevPage" />
      <input class="btn btn-sm" type="button" value="Next"
        v-bind:disabled="!hasNextPage"
        v-on:click="nextPage" />
      <span class="m-left-5">Page: {{ page + 1 }} Total: {{ total }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  IOptions,
  IColumn,
  IDataSource,
  IRow,
} from './interfaces';

import { dateTemplate, dateTimeTemplate } from './templates';

export default Vue.extend({
  props: {
    options: Object as () => IOptions,
  },
  data() {
    return {
      rows: [] as IRow[],
      total: 0,
      page: 0,
    };
  },
  mounted() {
    this.loadFromDataSource();
  },
  watch: {
    page() {
      this.loadFromDataSource();
    },
  },
  computed: {
    hasPrevPage(): boolean {
      return this.page > 0;
    },
    hasNextPage(): boolean {
      return this.total > this.take + this.skip;
    },
    take(): number {
      return this.options.dataSource.pageSize * (this.page + 1);
    },
    skip(): number {
      return this.options.dataSource.pageSize * this.page;
    },
    wrappedColumns(): IColumn[] {
      return this.options.columns.map((column) => {
        if (!column.display) {
          if (column.type === 'date') {
            column.display = dateTemplate();
          } else if (column.type === 'datetime') {
            column.display = dateTimeTemplate();
          }
        }

        return column;
      });
    },
    visibleColumns(): IColumn[] {
      return this.wrappedColumns.filter(column => column.hide !== true);
    },
  },
  methods: {
    nextPage() {
      if (!this.hasNextPage) return;
      this.page = this.page + 1;
    },
    prevPage() {
      if (this.page === 0) return;
      this.page = this.page - 1;
    },
    loadFromDataSource(opts?: { force: boolean }) {
      const options = {
        force: (opts && opts.force) || false,
        take: this.take,
        skip: this.skip,
      };
      return this.$store.dispatch(this.options.dataSource.read, options)
        .then((data) => {
          this.setRows(data);
        });
    },
    setRows(data: any) {
      let rows = [] as IRow[];
      if (this.options.dataSource.schema) {
        rows = data[this.options.dataSource.schema.results];
        this.total = data[this.options.dataSource.schema.total];
      } else {
        rows = data;
        this.total = data.length;
      }

      const hook = this.options.hooks && this.options.hooks.beforeDisplayRow;

      this.rows = rows.map((x) => {
        const row = { data: x };
        if (hook) hook(row);
        return row;
      });
    },
    refresh() {
      return this.loadFromDataSource({ force: true });
    },
    renderColumn(column: IColumn, row: any) {
      const rowData = column.data ? row[column.data] : '';
      if (column.display) {
        return column.display(rowData, row);
      }
      return rowData;
    },
    deleteRow(row: any) {
      const deleteAction = this.options.dataSource.delete;
      if (!deleteAction) return;

      const hook = this.options.hooks && this.options.hooks.beforeDelete;
      if (hook) {
        hook(row).then((result) => {
          if (!result) return;
          this.$store.dispatch(deleteAction, row.id).then(() => this.refresh());
        });
      } else {
        this.$store.dispatch(deleteAction, row.id).then(() => this.refresh());
      }
    },
  },
});
</script>
