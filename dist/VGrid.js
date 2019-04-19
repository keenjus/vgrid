import Vue from 'vue';
import moment from 'moment';

function dateTemplate() {
    return function instance(date) {
        if (!date)
            return '';
        return "<span title=\"" + date + "\">" + moment(date).format('YYYY-MM-DD') + "</span>";
    };
}
function dateTimeTemplate() {
    return function instance(date) {
        if (!date)
            return '';
        return "<span title=\"" + date + "\">" + moment(date).format('YYYY-MM-DD HH:mm') + "</span>";
    };
}

var script = Vue.extend({
    props: {
        options: Object,
    },
    data: function () {
        return {
            rows: [],
            total: 0,
            page: 0,
        };
    },
    mounted: function () {
        this.loadFromDataSource();
    },
    watch: {
        page: function () {
            this.loadFromDataSource();
        },
    },
    computed: {
        hasPrevPage: function () {
            return this.page > 0;
        },
        hasNextPage: function () {
            return this.total > this.take + this.skip;
        },
        take: function () {
            return this.options.dataSource.pageSize * (this.page + 1);
        },
        skip: function () {
            return this.options.dataSource.pageSize * this.page;
        },
        wrappedColumns: function () {
            return this.options.columns.map(function (column) {
                if (!column.display) {
                    if (column.type === 'date') {
                        column.display = dateTemplate();
                    }
                    else if (column.type === 'datetime') {
                        column.display = dateTimeTemplate();
                    }
                }
                return column;
            });
        },
        visibleColumns: function () {
            return this.wrappedColumns.filter(function (column) { return column.hide !== true; });
        },
    },
    methods: {
        nextPage: function () {
            if (!this.hasNextPage)
                return;
            this.page = this.page + 1;
        },
        prevPage: function () {
            if (this.page === 0)
                return;
            this.page = this.page - 1;
        },
        loadFromDataSource: function (opts) {
            var _this = this;
            var options = {
                force: (opts && opts.force) || false,
                take: this.take,
                skip: this.skip,
            };
            return this.options.dataSource.read(options)
                .then(function (data) {
                _this.setRows(data);
            });
        },
        setRows: function (data) {
            var rows = [];
            if (this.options.dataSource.schema) {
                rows = data[this.options.dataSource.schema.results];
                this.total = data[this.options.dataSource.schema.total];
            }
            else {
                rows = data;
                this.total = data.length;
            }
            var hook = this.options.hooks && this.options.hooks.beforeDisplayRow;
            this.rows = rows.map(function (x) {
                var row = { data: x };
                if (hook)
                    hook(row);
                return row;
            });
        },
        refresh: function () {
            return this.loadFromDataSource({ force: true });
        },
        renderColumn: function (column, row) {
            var rowData = column.data ? row[column.data] : '';
            if (column.display) {
                return column.display(rowData, row);
            }
            return rowData;
        },
        deleteRow: function (row) {
            var _this = this;
            var deleteAction = this.options.dataSource.delete;
            if (!deleteAction)
                return;
            var hook = this.options.hooks && this.options.hooks.beforeDelete;
            if (hook) {
                hook(row).then(function (result) {
                    if (!result)
                        return;
                    deleteAction(row).then(function () { return _this.refresh(); });
                });
            }
            else {
                deleteAction(row).then(function () { return _this.refresh(); });
            }
        },
    },
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"grid"},[_c('table',{staticClass:"grid-container max-width"},[_c('thead',[_c('tr',_vm._l((_vm.visibleColumns),function(column){return _c('th',{key:column.data,class:column.class},[_vm._v("\n          "+_vm._s(column.title || column.data)+"\n        ")])}),0)]),_vm._v(" "),_c('tbody',[_vm._l((_vm.rows),function(row,index){return _c('tr',{key:index,class:row.class},[_vm._l((_vm.visibleColumns),function(column){return [(column.command)?_c('td',{key:column.data,class:column.class,attrs:{"align":"center"}},[(column.command === 'delete')?_c('input',{staticClass:"btn btn-text-center btn-danger",attrs:{"type":"button","value":column.text || 'DELETE'},on:{"click":function($event){return _vm.deleteRow(row.data)}}}):_vm._e()]):_c('td',{key:column.data,class:column.class,domProps:{"innerHTML":_vm._s(_vm.renderColumn(column, row.data))}})]})],2)}),_vm._v(" "),(_vm.rows.length === 0)?_c('tr',[_c('td',{attrs:{"align":"center","colspan":_vm.visibleColumns.length}},[_vm._v("No data available")])]):_vm._e()],2),_vm._v(" "),_c('tfoot')]),_vm._v(" "),_c('div',{staticClass:"grid-pagination"},[_c('input',{staticClass:"btn btn-sm",attrs:{"type":"button","value":"Back","disabled":!_vm.hasPrevPage},on:{"click":_vm.prevPage}}),_vm._v(" "),_c('input',{staticClass:"btn btn-sm",attrs:{"type":"button","value":"Next","disabled":!_vm.hasNextPage},on:{"click":_vm.nextPage}}),_vm._v(" "),_c('span',{staticClass:"m-left-5"},[_vm._v("Page: "+_vm._s(_vm.page + 1)+" Total: "+_vm._s(_vm.total))])])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var VGrid = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//@ts-ignore

export default VGrid;
export { dateTemplate, dateTimeTemplate };
