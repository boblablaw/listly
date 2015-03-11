var Task = function() {
	var self = this;
	self.counter = 0;
	
	// write get set ID function here
	function getOrSetId(id) {
		if (!id) {
			id = self.counter + 1;
		}
		incrementCounter(id);
		return id;
	}

	function incrementCounter(id) {
		if (id > self.counter) {
			self.counter = id;
		}
	}

	function Task(properties) { //constructor
		this.name = properties.name;
		this.id = getOrSetId(properties.id);
		this.position = properties.position;
	}

	return Task;
}();