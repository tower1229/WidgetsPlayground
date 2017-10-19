define(function(require, exports, module) {
	"use strict";
	const util = require('js/assets/util');
	
	module.exports = {
		template: `<div class="filter" id="filter">
    <form>
        <fieldset>
            <legend>{{bread}}</legend>
            <div class="form-group tagWrap" id="tagWrap">
                <label>标签：</label>
                <span class="btn btn-primary btn-sm chooseAll" :class="showtag.length ? '' : 'active'"
                	@click="allClick">全部</span>
                <span v-for="tag in tags" class="btn btn-primary btn-sm" 
					:class="includes(tag) ? 'active' : ''"
                    @click="tagClick">{{tag}}</span> 
            </div>
            <div class="form-group" id="sortWrap">
                <label>排序：</label>
                <span class="btn btn-default" :class="sortBy === 'title' ? 'active' : ''" @click="triggerSort('title')">名称排序</span>
                <span class="btn btn-default" :class="sortBy === 'date' ? 'active' : ''" @click="triggerSort('date')">时间排序</span>
            </div>
        </fieldset>
    </form>
</div>`,
		computed: {
			tags: function() {
				return this.$store.state.tags;
			},
			bread: function() {
				return this.$store.state.bread;
			}
		},
		data: function() {
			return {
				showtag: [],
				sortBy: ''
			};
		},
		methods: {
			includes: function(tag) {
				let vm = this;
				return util.arrIncludes(vm.showtag, tag);
			},
			tagClick: function(event) {
				let text = event.target.innerText;
				let index = this.showtag.findIndex(function(value) {
					return value === text;
				});
				if (index > -1) {
					this.showtag.splice(index, 1);
				} else {
					this.showtag.push(text);
				}
				this.doFilter();
			},
			allClick: function() {
				this.showtag = [];
				this.doFilter();
			},
			triggerSort: function(by) {
				if (this.sortBy === by) {
					this.sortBy = '';
				} else {
					this.sortBy = by;
				}
				this.doFilter();
			},
			doFilter: function(to) {
				let thePath = to ? to.path : null;
				let theQuery = {};
				if (this.showtag.length) {
					theQuery.tag = JSON.stringify(this.showtag);
				}

				if (this.sortBy) {
					theQuery.sort = this.sortBy;
				}

				this.$router.push({
					path: thePath,
					query: theQuery
				});

				this.$store.commit('filterTag', this.showtag);
				this.$store.commit('sort', this.sortBy);
			}
		},
		created: function() {
			if (this.$route.query.tag) {
				this.showtag = JSON.parse(this.$route.query.tag);
			}
			if (this.$route.query.sort) {
				this.sortBy = this.$route.query.sort;
			}
			this.doFilter();
		}
	};
});