var func = function() {

	function Draggable (element, drag, dragDrop){

		this.element = element;
		this.drag = drag;
		this.dragDrop = dragDrop;

		this.element.classList.add('draggable');
		var self = this;

		var move = function(event){
			//console.log(event.type);
			//console.log(event.currentTarget);
			var originLeft = imageElement.getBoundingClientRect().left
			var originTop = imageElement.getBoundingClientRect().top;

			var mouseDownX = event.clientX;
			var mouseDownY = event.clientY;

			var initialWidth = document.getElementById('terminal').offsetWidth;
			function dragMe(event){
				self.element.style.width = initialWidth + 'px';
				self.element.style.position = 'absolute';
				self.element.style.left = (originLeft + event.clientX - mouseDownX) + "px";
				self.element.style.top = originTop + event.clientY - mouseDownY + "px";
				event.stopPropagation();
				console.log(self.element.style.width)
			}

			function dropMe(event){
				document.removeEventListener('mousemove', dragMe, true);
				document.removeEventListener('mouseup', dropMe, true);
				event.stopPropagation();
				
			}

			document.addEventListener('mouseup', dropMe, true);
			document.addEventListener('mousemove', dragMe, true);
			
		};

		this.element.addEventListener('mousedown', move, false);
	};

	var imageElement = document.getElementById('terminal');
	var dragElem = new Draggable(imageElement);
};

window.addEventListener('load', func, false);