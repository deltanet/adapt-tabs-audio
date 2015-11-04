define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var TabsAudio = ComponentView.extend({

		events: {
			'click .tabsAudio-navigation-item': 'onTabItemClicked'
		},
		
		preRender: function() {
		},

		postRender: function() {
			this.setReadyStatus();
			this.setLayout();
			this.listenTo(Adapt, 'device:resize', this.setLayout);
			this.showContentItemAtIndex(0, true);
			this.setTabSelectedAtIndex(0);
		},

		setLayout: function() {
			this.$el.removeClass("tabAudio-layout-left tabAudio-layout-top");
			if (Adapt.device.screenSize == 'large') {
				var tabLayout = this.model.get('_tabLayout');
				this.$el.addClass("tabAudio-layout-" + tabLayout);
				if (tabLayout === 'top') {
					this.setTabLayoutTop();
				} else if (tabLayout === 'left') {
					this.setTabLayoutLeft();
				}                
			} else {
				this.$el.addClass("tabAudio-layout-left");
				this.setTabLayoutLeft();
			}        	
		},

		setTabLayoutTop: function() {
			var itemsLength = this.model.get('_items').length;
			var itemWidth = 100 / itemsLength;

			this.$('.tabsAudio-navigation-item').css({
				width: itemWidth + '%'
			});
		},

		setTabLayoutLeft: function() {
			this.$('.tabsAudio-navigation-item').css({
				width: 100 + '%'
			});
		},

		onTabItemClicked: function(event) {
			event.preventDefault();
			var index = $(event.currentTarget).index();
			this.showContentItemAtIndex(index);
			this.setTabSelectedAtIndex(index);
			this.setVisited($(event.currentTarget).index());			
		},

		showContentItemAtIndex: function(index, skipFocus) {
			var $contentItems = this.$('.tabAudio-content');

			$contentItems.removeClass('active').velocity({
				opacity: 0,
				translateY: '20px'
			}, {
				duration: 0,
				display: 'none'
			});

			var $contentItem = $contentItems.eq(index);
			$contentItem.velocity({
				opacity: 1,
				translateY: '0'
			}, {
				duration: 300,
				display: 'block',
				complete: _.bind(complete,this)
			});

			function complete() {
				if (skipFocus) return;
	            $contentItem.addClass('active').a11y_focus();
			}
		},

		setTabSelectedAtIndex: function(index) {
			var $navigationItem = this.$('.tabsAudio-navigation-item-inner');
			$navigationItem.removeClass('selected').eq(index).addClass('selected visited').attr('aria-label', this.model.get("_items")[index].tabTitle + ". Visited");
			this.setVisited(index);
		},

		setVisited: function(index) {
			var item = this.model.get('_items')[index];
			item._isVisited = true;
			this.checkCompletionStatus();
		},

		getVisitedItems: function() {
			return _.filter(this.model.get('_items'), function(item) {
				return item._isVisited;
			});
		},

		checkCompletionStatus: function() {
			if (this.getVisitedItems().length == this.model.get('_items').length) {
				this.setCompletionStatus();
			}
		}
		
	});
	
	Adapt.register("tabs-audio", TabsAudio);

	return TabsAudio;
	
});
