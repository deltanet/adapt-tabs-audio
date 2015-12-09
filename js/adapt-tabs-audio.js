define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var TabsAudio = ComponentView.extend({

		events: {
			'click .tabsAudio-navigation-item': 'onTabItemClicked'
		},
		
		preRender: function() {
			// Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
		},

		postRender: function() {
			this.setReadyStatus();
			this.setLayout();
			this.listenTo(Adapt, 'device:resize', this.setLayout);
			this.showContentItemAtIndex(0, true);
			this.setTabSelectedAtIndex(0);

			if (this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled && Adapt.config.get('_reducedText')._isEnabled) {
				this.replaceText(Adapt.audio.textSize);
            }
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

			var $item = $(event.currentTarget).parent();
            var currentItem = this.getCurrentItem($item.index());

			///// Audio /////
            if (this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
                // Determine which filetype to play
                if (Adapt.audio.audioClip[this.model.get('_audio')._channel].canPlayType('audio/ogg')) this.audioFile = currentItem._audio.ogg;
                if (Adapt.audio.audioClip[this.model.get('_audio')._channel].canPlayType('audio/mpeg')) this.audioFile = currentItem._audio.mp3;
                // Trigger audio
                Adapt.trigger('audio:playAudio', this.audioFile, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////
		},

		///// Audio /////
		getCurrentItem: function(index) {
            return this.model.get('_items')[index];
        },
        ///// End of Audio /////

		showContentItemAtIndex: function(index, skipFocus) {
			var $contentItems = this.$('.tabAudio-content');

			$contentItems.removeClass('active').velocity({
				opacity: 0,
				translateY: '0px'
				//translateY: '20px'
			}, {
				duration: 0,
				display: 'none'
			});
			
			var $contentItem = $contentItems.eq(index);
			$contentItem.velocity({
				opacity: 1,
				translateY: '0'
			}, {
				duration: 1000,
				//duration: 300,
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
		},

		// Reduced text
        replaceText: function(value) {
            // If enabled
            if (this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled && Adapt.config.get('_reducedText')._isEnabled) {
                // Change component title and body
                if(value == 0) {
                    this.$('.component-title-inner').html(this.model.get('displayTitle')).a11y_text();
                    this.$('.component-body-inner').html(this.model.get('body')).a11y_text();
                } else {
                    this.$('.component-title-inner').html(this.model.get('displayTitleReduced')).a11y_text();
                    this.$('.component-body-inner').html(this.model.get('bodyReduced')).a11y_text();
                }
                // Change each items title and body
                for (var i = 0; i < this.model.get('_items').length; i++) {
                    if(value == 0) {
                    	this.$('.tabsAudio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitle);
                        this.$('.tabAudio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].title);
                        this.$('.tabAudio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].body);
                    } else {
                    	this.$('.tabsAudio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitleReduced);
                        this.$('.tabAudio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].titleReduced);
                        this.$('.tabAudio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
                    }
                }
            }
        }
		
	});
	
	Adapt.register("tabs-audio", TabsAudio);

	return TabsAudio;
	
});
