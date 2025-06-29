var elem = document.getElementById('diceRoller');
//var elem = document.getElementById('dicearea');
var box = new DICE.dice_box(elem);

function doRoll(type)
{
	if(type === 'normal')
		box.setDice("d20");
	else if(type === 'bonus')
		box.setDice("d6");
	box.start_throw(before_roll, after_roll);
}

function before_roll(notation)
{  
    //var mainarea = document.getElementById('mainarea');
	//mainarea.style.opacity = 0.2;
	return null;
}

function after_roll(notation)
{
    //var mainarea = document.getElementById('mainarea');
	//mainarea.style.opacity = 1.0;
	
	var result = notation.result[0];
	var die = notation.set[0];
	var lookup;
	
	if(die === 'd20')
	{
		lookup = gamedata.effects;
	}
	else if(die === 'd6')
	{
		lookup = gamedata.bonus_effects;
	}
	
	var headElem = document.getElementById('lastroll-title');
	var descElem = document.getElementById('lastroll-desc');
	var numElem = document.getElementById('lastroll-num');
	var logElem = document.getElementById('lastroll-log');
	
	headElem.innerText = lookup[result].name;
	descElem.innerText = lookup[result].description;
	logElem.innerText = numElem.innerText;
	numElem.innerText = result;
}

/*
function doRoll(type)
{
	var result;
	var lookup;
	
	if(type === 'normal')
	{
		result = RollD(20);
		lookup = gamedata.effects;
	}
	else if(type === 'bonus')
	{
		result = RollD(6);
		lookup = gamedata.bonus_effects;
	}
	
	var headElem = document.getElementById('lastroll-title');
	var descElem = document.getElementById('lastroll-desc');
	var numElem = document.getElementById('lastroll-num');
	var logElem = document.getElementById('lastroll-log');
	
	headElem.innerText = lookup[result].name;
	descElem.innerText = lookup[result].description;
	logElem.innerText = numElem.innerText;
	numElem.innerText = result;
}
*/

function RollD(sides)
{
	return Math.floor(Math.random() * sides) + 1;
}

function btnDivMul(type, amount)
{
	var selectedStat = getRadioValue('stat');
	if(!selectedStat) return;
	
	var valueElem = document.getElementById('stat' + selectedStat + '-value');
	var unitElem = document.getElementById('stat' + selectedStat + '-unit');
	
	if(unitElem.innerText === '') return;
	
	var val = Decimal(sanitizeNumber(valueElem.innerText));
	val = UnitHelper.unitToMm(val, unitElem.innerText);
	
	if(type === 'div')
	{
		if(val.greaterThan(10))
			val = val.dividedBy(amount);
	}
	else if(type === 'mul')
	{
		val = val.times(amount);
	}
	
	var result = UnitHelper.mmToAppropriateUnit(val);
	valueElem.innerText = result.value.toFixed(2);
	unitElem.innerText = result.unit;
}

function btnAddSub(type, amount)
{
	var selectedStat = getRadioValue('stat');
	if(!selectedStat) return;
	
	var valueElem = document.getElementById('stat' + selectedStat + '-value');
	var unitElem = document.getElementById('stat' + selectedStat + '-unit');
	
	if(unitElem.innerText !== '') return;
	
	var val = Decimal(sanitizeNumber(valueElem.innerText));
	
	if(type === 'sub')
	{
		if(val.greaterThan(amount))
			val = val.minus(amount);
		else
			val = Decimal(1);
	}
	else if(type === 'add')
	{
		val = val.add(amount);
	}
	
	valueElem.innerText = val.toFixed(0);
}

function sanitizeNumber(str) {
	const regex = /[^\d.\-]/ig;
	return str.replaceAll(regex, '');
}

function getRadioValue(elementName) {
	var radios = document.getElementsByName(elementName);
	
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
}

function btnRename()
{
	var titleElem = document.getElementById('heading-name');
	var inputElem = document.getElementById('heading-input');
	var btnElem = document.getElementById('heading-btn');
	
	if(inputElem.style.visibility === 'hidden')
	{
		inputElem.style.visibility = 'visible';
		btnElem.innerText = "Save";
		inputElem.value = '';
	}
	else
	{
		inputElem.style.visibility = 'hidden';
		btnElem.innerText = "Rename";
		if(inputElem.value !== '')
		{
			titleElem.innerText = inputElem.value;
		}
	}
}

function btnAddStat()
{
	var deladdElem = document.getElementById('stat-deladd');
	var inputElem = document.getElementById('stat-input');
	
	var nameElem = document.getElementById('stat-name-input');
	var valElem = document.getElementById('stat-value-input');
	var unitElem = document.getElementById('stat-unit-input');
	
	if(inputElem.style.display === 'none')
	{
		inputElem.style.display = '';
		deladdElem.style.display = 'none';
		
		nameElem.value = '';
		valElem.value = '';
		unitElem.value = 'cm';
	}
}

function btnSaveStat()
{
	var deladdElem = document.getElementById('stat-deladd');
	var inputElem = document.getElementById('stat-input');
	
	var nameElem = document.getElementById('stat-name-input');
	var valElem = document.getElementById('stat-value-input');
	var unitElem = document.getElementById('stat-unit-input');
	
	var containerElem = document.getElementById('stats-container');
	
	if(inputElem.style.display !== 'none')
	{
		inputElem.style.display = 'none';
		deladdElem.style.display = '';
		
		var valFromElem = sanitizeNumber(valElem.value);
		
		if(nameElem.value !== '' && valFromElem !== '')
		{
			var statNo = (containerElem.childElementCount + 1);
			
			var propLineElem = document.createElement('div');
			propLineElem.id = 'stat' + statNo + '-div';
			propLineElem.classList.add('property-line');
			
			// <input id="statN-rd" type="radio" name="stat" value="N" />
			var radioElem = document.createElement('input');
			radioElem.id = 'stat' + statNo + '-rd';
			radioElem.type = 'radio';
			radioElem.name = 'stat';
			radioElem.value = statNo;
			if(statNo === 1) radioElem.checked = true;
			propLineElem.appendChild(radioElem);
			propLineElem.append(' ');
			
			//<h4 id="statN-name"></h4>
			var h4Elem = document.createElement('h4');
			h4Elem.id = 'stat' + statNo + '-name';
			h4Elem.innerText = nameElem.value;
			propLineElem.appendChild(h4Elem);
			propLineElem.append(' ');
			
			//<p id="statN-value"></p>
			var pVElem = document.createElement('p');
			pVElem.id = 'stat' + statNo + '-value';
			pVElem.innerText = valFromElem;
			pVElem.style.lineBreak = 'anywhere';
			propLineElem.appendChild(pVElem);
			propLineElem.append(' ');
			
			//<p id="statN-unit">cm</p>
			var pUElem = document.createElement('p');
			pUElem.id = 'stat' + statNo + '-unit';
			if(unitElem.value !== 'none')
				pUElem.innerText = unitElem.value;
			else
				pUElem.innerText = '';
			propLineElem.appendChild(pUElem);
			
			containerElem.appendChild(propLineElem);
		}
	}
}

function btnCancelStatEdit()
{
	var deladdElem = document.getElementById('stat-deladd');
	var inputElem = document.getElementById('stat-input');
	
	if(inputElem.style.display !== 'none')
	{
		inputElem.style.display = 'none';
		deladdElem.style.display = '';
	}
}

function btnDelStat()
{
	var containerElem = document.getElementById('stats-container');
	if(containerElem.childElementCount <= 0) return;
	
	var selectedStat = getRadioValue('stat');
	if(selectedStat)
	{
		var divElem = document.getElementById('stat' + selectedStat + '-div');
		containerElem.removeChild(divElem);
	}
}

function btnStatusChange(type, elemId, step)
{
	if(!step) step = 1;
	
	var counterElem = document.getElementById(elemId + '-count');
	var descElem = document.getElementById(elemId + '-desc');
	var headElem = document.getElementById(elemId + '-head');
	
	var count = parseInt(counterElem.innerText);
	if(type === 'add')
		count += step;
	else if(type === 'sub')
		count -= step;
	if(count < 0) count = 0;
	
	counterElem.innerText = count;
	toggleStrikethrough(descElem, count);
	toggleStrikethrough(headElem, count);
}

function toggleStrikethrough(elem, count)
{
	if(count > 0)
	{
		if(elem.classList.contains('strikethrough'))
			elem.classList.remove('strikethrough');
	}
	else
	{
		if(!elem.classList.contains('strikethrough'))
			elem.classList.add('strikethrough');
	}
}

function onOpacity(elemId, opacityValue)
{
	var elem = document.getElementById(elemId);
	elem.style.opacity = opacityValue;
}

class UnitHelper {
    static instance = new UnitHelper();

    static mmToUnit(value, unit) {
        return UnitHelper.instance.mmToUnit(value, unit);
    }

    static unitToMm(value, unit) {
        return UnitHelper.instance.unitToMm(value, unit);
    }

    static mmToAppropriateUnit(value) {
        return UnitHelper.instance.mmToAppropriateUnit(value);
    }

    constructor() {
        this.units = [
            { name: "mm", factor: Decimal(1) },
            { name: "cm", factor: Decimal(10) },
            { name: "m", factor: Decimal(1000) },
            { name: "km", factor: Decimal(1000 * 1000) },
            { name: "AU", factor: Decimal("149597870700000") },
            { name: "ly", factor: Decimal("9460730472580800000") },
            { name: "Gly", factor: Decimal("9460730472580800000000000000") },
			{ name: "ObU", factor: Decimal("879847933950014400000000000000") },
            { name: "Ely", factor: Decimal("9460730472580800000000000000000000000") },
			{ name: "Rly", factor: Decimal("9460730472580800000000000000000000000000000000") },
        ];

        this.unitmap = {};
        for(var u in this.units) {
            this.unitmap[this.units[u].name] = this.units[u];
        }
    }

    mmToUnit(value, unit) {
        return value.dividedBy(this.unitmap[unit].factor);
    }

    unitToMm(value, unit) {
        return value.times(this.unitmap[unit].factor);
    }

    mmToAppropriateUnit(value) {
        for(var i = this.units.length - 1; i >= 0; --i) {
            if(value.greaterThan(this.units[i].factor) || i <= 0) {
                return { value: this.mmToUnit(value, this.units[i].name), unit: this.units[i].name };
            }
        }
    }
}

gamedata = {
    effects: {
        1: {
            name: 'Critical Miss.',
            description: 'Shrink to 1/1000 your current size! Man, that sucks.',
        },
        2: {
            name: 'Miss.',
            description: 'Shrink to 1/10 of your current size. Better luck next time!',
        },
        3: {
            name: ' It\'s a dud...',
            description: 'Nothing happens. At least you\'re not getting smaller...',
        },
        4: {
            name: '"Modest" Growth.',
            description: 'You grow by a factor of 10.',
        },
        5: {
            name: 'Gift.',
            description: 'A person of your choice grows by a factor of 100 in a manner of their choosing.',
        },
        6: {
            name: 'Free for All.',
            description: 'Everyone grows by a factor of 100.',
        },
        7: {
            name: 'Roll Enhancement.',
            description: 'You don\'t grow this turn, but your next growth is 100 times stronger.',
        },
        8: {
            name: 'Multigrow.',
            description: 'Grow by a factor of 10 in any three ways you like, or stack them onto one for a factor of 1,000.',
        },
        9: {
            name: 'Big Growth Spurt.',
            description: 'Grow by a factor of 1,000.',
        },
        10: {
            name: 'Seeing Double.',
            description: 'Add an extra body part or clone. Alternatively, grow by a factor of 1,000.',
        },
        11: {
            name: 'Thievery.',
            description: 'Shrink a player of your choice to 1/100 size, then grow by a factor of 100.',
        },
        12: {
            name: 'Safeguard.',
            description: 'Next time you roll a 1, 2, or 3, grow by a factor of 100 instead.',
        },
        13: {
            name: 'Growth Police.',
            description: 'Block the next attempt by a player to steal your size.',
        },
        14: {
            name: 'Mega Growth Spurt.',
            description: 'Grow by a factor of 10,000.',
        },
        15: {
            name: 'Master Thief.',
            description: 'Shrink a player of your choice to 1/1000 size, then grow by a factor of 1,000.',
        },
        16: {
            name: 'Mimicry.',
            description: 'The effects of the next two players\' next rolls also apply to you.',
        },
        17: {
            name: 'Multiroll.',
            description: 'Roll the dice 3 more times and apply all effects! If you roll 17 again, reroll.',
        },
        18: {
            name: 'Super Growth Spurt.',
            description: 'You grow by a factor of 100,000!',
        },
        19: {
            name: 'Super Multigrow.',
            description: 'Grow by a factor of 100 in any three ways you like, or stack them into one for a factor of 100,000.',
        },
        20: {
            name: 'Critical Hit.',
            description: ' You roll one D6 for a bonus effect as described in the Bonus Effects list.',
        },
    },

    bonus_effects: {
        1: {
            name: 'Super Multigrow!',
            description: 'Pick 3 characteristics to grow 1,000 times larger, or stack them on 1!',
        },
        2: {
            name: 'King of Thieves!',
            description: 'One time after a player rolls, you may steal the results for yourself.',
        },
        3: {
            name: 'Even the Odds!',
            description: 'Match the size of the largest player. If you are the largest, grow by a factor of 100,000.',
        },
        4: {
            name: 'Ultra Growth Spurt!',
            description: 'You grow 1,000,000 times larger!',
        },
        5: {
            name: 'Growth Power!',
            description: 'You grow 1,000,000,000 times larger!',
        },
        6: {
            name: 'Critical Critical!',
            description: 'All future growth rolls are 100 times stronger! Rolling this again increases the multiplier to 1,000 for the next growth.',
        },
    },
}