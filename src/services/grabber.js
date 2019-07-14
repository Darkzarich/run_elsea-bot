const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const scripts = require('./scripts.js');
const until = require('selenium-webdriver/lib/until')
const By = webdriver.By;

const initDriver = () => {
	const screen = {
		width: 1024,
		height: 768
	};

	const driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
	    .build();
	driver.get('https://aidoru.info/token');
	driver.wait(function() {
	    return driver.executeScript( scripts.getScriptReadyState() )
	}).then(function(readyState) {
	    return readyState === 'complete';
	});

	return driver
}

function errorLogWrapper(e, debug=true) {
	if (debug == true) {
		return e;
	} else {
		return { error: 'No event is going at the present time, don\'t use "curevent"' }
	}
}

const grab = (driver, command) => {
	return new Promise( (resolve, reject) => {
	    try {
	        Object.keys(command).forEach( el => {
	            driver.findElement(By.id(el)).then(field => {
	                if (command[el] == true) {
	                    driver.executeScript( scripts.getScriptClickCheckbox(el) ).then( () => {
	                        command[el] = '';
	                    })
	                } else if (command[el].length && typeof command[el] == 'string') {
	                    driver.executeScript( scripts.getScriptSelectDifficulty(command[el]) ).then( () => {
	                        command[el] = ''
	                    })
	                } else if (command[el] !== false) {
	                    field.sendKeys(webdriver.Key.chord(webdriver.Key.CONTROL,"a", webdriver.Key.DELETE)).then( (f) => {
	                        field.sendKeys(command[el])
	                        command[el] = '';
	                    })
	                }
	            }) 
	        })

	        driver.wait( () => {

	            let ret = true

	            Object.keys(command).forEach( key => {
	                if (command[key] != '') {
	                    ret = false
	                }
	            })
	            return ret
	        }).then( () => {

	            let submitButton = driver.findElement(By.xpath("//input[@type='submit']"))
	            driver.executeScript(scripts.getScriptScrollCenter(), submitButton);
	            driver.sleep(50);
	            submitButton.click().then( () => {
		            driver.sleep(100);
		            let summary = driver.findElement(By.className( 'col-md-4' )).catch(e => {
	            	driver.switchTo().alert().accept()
	            	reject(errorLogWrapper(e))	
	            });
		            driver.sleep(500)
		            driver.executeScript(scripts.getScriptScrollStart(), summary).catch(e => {
	            	driver.switchTo().alert().accept()
	            	reject(errorLogWrapper(e))	
	            });;
		            driver.sleep(200).then( () => {

		            	driver.wait(until.elementLocated(By.className('table')), 2000).then( el => {
				            el.takeScreenshot().then(function(data) {
				              resolve(data)
				            }).catch(e => {
			            	driver.switchTo().alert().accept()
			            	reject(errorLogWrapper(e))	
			            	});;
		            	}).catch(e => {
		            		driver.sleep(100)
		            		driver.executeScript(scripts.getScriptScrollStart(), summary)
		            		driver.wait(until.elementLocated(By.className('table')), 3000).then( el => {
					            el.takeScreenshot().then(function(data) {
					              resolve(data)
					            }).catch(e => {
				            	driver.switchTo().alert().accept()
				            	reject(errorLogWrapper(e))	
				            	});;
		            		}).catch(e => {
		            			reject(errorLogWrapper(e))
		            		})
		            	});

		            }).catch(e => {
	            	driver.switchTo().alert().accept()
	            	reject(errorLogWrapper(e))	
	            });
	            }).catch(e => {
	            	driver.switchTo().alert().accept()
	            	reject(errorLogWrapper(e))	
	            });

	        }).catch(e => {
	            	driver.switchTo().alert().accept()
	            	reject(errorLogWrapper(e))	
	            });
	    } catch (e) {

	    	if (e instanceof UnexpectedAlertOpenError) {
	    		driver.switchTo().alert().accept()
	            reject(errorLogWrapper(e))	
	    	}

	    	console.error(e)
	    	reject(e)
	    }
	})
}

module.exports = {
	initDriver,
	grab,
}