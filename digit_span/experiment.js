
/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* var getDigit = function (){
	if(blockTrial==0){
		for (ii=0; ii<blockLength; ii++){
		indexStimArray=[]
		indexStim=Math.floor(Math.random()*9+1)
		indexStimArray.push(indexStim)
		}
		temp=indexStimArray.pop
		stim=stimArray[temp]
		return '<div class = middleMiddle><img src="'+pathSource+stim+fileType+'"></img></div>'			
	}else if(blockTrial>0){
		temp=indexStimArray.pop
		stim=stimArray[temp]
		return '<div class = middleMiddle><img src="'+pathSource+stim+fileType+'"></img></div>'
	}
}; */


// This function generates a stim array of a specific size, num, that is different than the initially set stim array.  This
// will be fed into the stim parameter of single-stim block
var generateStim = function (num){
	displayStimArray=[]
		for(h=0;h<num;h++){
		indexStim=Math.floor(Math.random()*9+1)
		stim=stimArray[indexStim]
		displayStimArray.push('<div class = middleMiddle><img src="'+pathSource+stim+fileType+'"></img></div>')
		}
		return displayStimArray;

}

// returns a stim from displayStimArray
var getDigit = function(){
	return displayStimArray.pop()		
}
	
// adds data to the trial	
var appendData = function(){
	jsPsych.data.addDataToLastTrial({trial_num:currTrial, block_trial: blockTrial})
	blockTrial=blockTrial+1	
	global_trial = jsPsych.progress().current_trial_global
}


var update_length = function (){
blockTrial=0
blockLength=blockLength+1
global_trial = jsPsych.progress().current_trial_global
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var blockNum=2
var blockTrial=0 //num trial within a block of trials
var blockLength=5  //variable to be changed!! how many trials within a block of trials
var currTrial=0 //global
var stimArray=['0','1','2','3','4','5','6','7','8','9'];
var pathSource ='static/experiments/digit_span/images/'
var fileType = '.png'
var num = 5

var randomStimArray=jsPsych.randomization.repeat(stimArray,1)
var stim1=randomStimArray[0]
var stim2=randomStimArray[1]
var stim3=randomStimArray[2]
var stim4=randomStimArray[3]
var stim5=randomStimArray[4]


var displayStimArray=['<div class = middleMiddle><img src="'+pathSource+stim1+fileType+'"></img></div>','<div class = middleMiddle><img src="'+pathSource+stim2+fileType+'"></img></div>',
'<div class = middleMiddle><img src="'+pathSource+stim3+fileType+'"></img></div>', '<div class = middleMiddle><img src="'+pathSource+stim4+fileType+'"></img></div>',
'<div class = middleMiddle><img src="'+pathSource+stim5+fileType+'"></img></div>']
		




/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */


var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the Digit Span task. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};


var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages:  [
	'<div class = centerbox><p class = block-text>In this experiment, you will be presented with 6 letters, known as your training set.  You must memorize all 6 letters. </p></div>',
    '<div class = centerbox><p class = block-text>After the presentation of 6 letters, you will be presented with a  single letter, respond with the <strong> Left</strong> arrow key if it was in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test.</p><p class = block-text> Press <strong>Enter</strong> to begin the experiment.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

trainingTrials=[]
for(i=0; i<blockLength; i++){
	var training_block = {
  		type: 'single-stim',
  		stimuli: getDigit,
  		is_html: true,
  		data: {exp_id: "digit_span", trial_id: "test"},
  		choices: 'none',
  		timing_post_trial: 3000,
  		timing_stim: 2000,
  		timing_response: 1000,
  		on_finish: appendData,
	};	
	trainingTrials.push(training_block)
}


var performance_criteria = {
    chunk_type: 'while',
    timeline: trainingTrials,
	continue_function: function(data){
	console.log('block = '+blockLength)
	
	displayStimArray=generateStim(num)
	return true
	}
};	



var response_block = {
	type: 'survey-text',
	questions: [['What was the sequence of numbers? Please separate your numbers with a space']],
	data: {exp_id: 'digit_span', trial_id: 'response'}
};		
		
var update_length_block = {
	type: 'call-function',
	func: update_length,
    timing_post_trial: 0
};


/* create experiment definition array */
var digit_span_experiment = [];

digit_span_experiment.push(performance_criteria)



	
//digit_span_experiment.push(response_block);
