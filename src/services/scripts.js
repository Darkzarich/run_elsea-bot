const getScriptReadyState = () => {
	return 'return document.readyState'
}

const getScriptClickCheckbox = (el) => {
	return `document.getElementById('${el}').click(); return;`
}

const getScriptSelectDifficulty = (difficulty) => {
	return `
		let diffList = document.getElementById('difSelect').options;
		for (let item of diffList) {
		  if (item.innerHTML.toLowerCase().includes('${difficulty}')) {
		    document.getElementById('difSelect').value = item.value
		  }
		}
		return;
     	`
}

const getScriptScrollCenter = () => {
	return "arguments[0].scrollIntoView({block: 'center'})"
}

const getScriptScrollStart = () => {
	return "arguments[0].scrollIntoView({block: 'start'})"
}

module.exports = {
	getScriptReadyState,
	getScriptClickCheckbox,
	getScriptSelectDifficulty, 
	getScriptScrollCenter,
	getScriptScrollStart
};