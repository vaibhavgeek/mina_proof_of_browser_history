try{
	function getHistoryFromChrome(history){
		console.log("history", history);
		const injectElement = document.createElement('div');
		injectElement.id = 'history-man';
		const frequency = new Map();

		history.forEach((item) => {
			var tmp = document.createElement ('a');
			tmp.href = item.url;
			if(frequency.get(tmp.hostname) && frequency.size < 11){
				const count = parseInt(frequency.get(tmp.hostname));
				frequency.set(tmp.hostname, count+1);
			}
			else
			{
				frequency.set(tmp.hostname,1);
			}
			
		});
		for (let key of frequency.keys()) {
			injectElement.innerHTML += key + " - " + frequency.get(key) + " <br/>"; 
		}
		
		document.body.appendChild(injectElement);
	}
	//ON page change
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	  if(changeInfo.status == 'complete'){
		chrome.history.search({
			'text': '',
			'maxResults': 75
	 	}, function(historyItem) {
			chrome.scripting.executeScript({
				function: getHistoryFromChrome,
				target: {tabId: tab.id},
				args:  [history=historyItem]
			  });
	 	});		
	  }
	});
  
  }catch(e){
	console.log(e);
  }