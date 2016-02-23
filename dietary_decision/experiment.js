/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function evalAttentionChecks() {
  var check_percent = 1
  if (run_attention_checks) {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
    var checks_passed = 0
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1
      }
    }
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

function addID() {
  jsPsych.data.addDataToLastTrial({
    'exp_id': 'dietary_decision'
  })
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getHealthStim = function() {
  curr_stim = health_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    health_response_area
}

var getTasteStim = function() {
  curr_stim = taste_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    taste_response_area
}

var getDecisionStim = function() {
  curr_stim = decision_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    decision_response_area
}

var getDecisionText = function() {
  return '<div class = centerbox><p class = "block-text">In the next block of trials you should choose whether you would rather eat the food shown on each trial OR the food shown below. You will select response from "Strong No", "No", "Neutral", "Yes" and "Strong Yes". "No" means that you would rather eat the food below, while "Yes" means you would rather eat the food displayed on that trial.</p>Press <strong>enter</strong> to begin.</p></div></div><div class = dd_referenceBox><img class = dd_Stim src = ' +
    base_path + reference_stim + ' </img></div>'
}

function median(values) {
  values.sort(function(a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}

var setUpTest = function() {
  // Calculate avg scores
  var random_stims = jsPsych.randomization.shuffle(stims)
  var ratings = {
    'taste': [],
    'health': []
  }
  for (var i = 0; i < stims.length; i++) {
    var key = stims[i]
    ratings.taste.push(stim_ratings[key].taste)
    ratings.health.push(stim_ratings[key].health)
  }
  var median_taste = median(ratings.taste)
  var median_health = median(ratings.health)
  var min_distance = 100
  for (var i = 0; i < stims.length; i++) {
    var key = random_stims[i]
    var taste_dist = Math.pow((stim_ratings[key].taste - median_taste), 2)
    var health_dist = Math.pow((stim_ratings[key].health - median_health), 2)
    var dist = health_dist + taste_dist
    if (dist < min_distance) {
      if (reference_stim != '') {
        decision_stims.push(reference_stim)
      }
      reference_stim = key
      min_distance = dist
    } else {
      decision_stims.push(key)
    }
  }
}


var getInstructFeedback = function() {
    return '<div class = centerbox><p class = "center-block-text">' +
      feedback_instruct_text + '</p></div>'
  }
  /* ************************************ */
  /* Define experimental variables */
  /* ************************************ */
  // generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var practice_len = 36
var exp_len = 180
var curr_trial = 0
var choices = [74, 75, 76]
var healthy_responses = ['Very_Unhealthy', 'Unhealthy', 'Neutral', 'Healthy', 'Very_Healthy']
var tasty_responses = ['Very_Bad', 'Bad', 'Neutral', 'Good', 'Very_Good']
var decision_responses = ['Strong_No', 'No', 'Neutral', 'Yes', 'Very_Yes']

var health_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Very_Unhealthy>Very Unhealthy</button>' +
  '<button class = dd_response_button id = Unhealthy>Unhealthy</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Healthy>Healthy</button>' +
  '<button class = dd_response_button id = Very_Healthy>Very Healthy</button></div>'

var taste_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Very_Bad>Very Bad</button>' +
  '<button class = dd_response_button id = Bad>Bad</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Good>Good</button>' +
  '<button class = dd_response_button id = Very_Good>Very Good</button></div>'

// Higher value indicates choosing the food item over the neutral food item.
var decision_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Strong_No>Strong No</button>' +
  '<button class = dd_response_button id = No>No</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Yes>Yes</button>' +
  '<button class = dd_response_button id = Strong_Yes>Strong Yes</button></div>'

var base_path = '/static/experiments/dietary_decision/images/'
var stims = ['100Grand.bmp', 'banana.bmp', 'blueberryyogart.bmp', 'brocollincauliflower.bmp',
  'butterfinger.bmp', 'carrots.bmp', 'cellery.bmp', 'cherryicecream.bmp',
  'ChipsAhoy.bmp', 'cookiencream.bmp', 'cookies.bmp', 'cranberries.bmp',
  'Doritosranch.bmp', 'FamousAmos.bmp', 'ffraspsorbet.bmp', 'FlamingCheetos.bmp',
  'frozenyogart.bmp', 'Ghiradelli.bmp', 'grannysmith.bmp', 'HoHo.bmp',
  'icecreamsandwich.bmp', 'keeblerfudgestripes.bmp', 'keeblerrainbow.bmp', 'KitKat.bmp',
  'laysclassic.bmp', 'Lindt.bmp', 'mixedyogart.bmp', 'MrsFields.bmp', 'orange.bmp',
  'orangejello.bmp', 'Oreos.bmp', 'raisins.bmp', 'reddelicious.bmp',
  'redgrapes.bmp', 'Reeses.bmp', 'RiceKrispyTreat.bmp', 'ruffles.bmp',
  'sbcrackers.bmp', 'sbdietbar.bmp', 'slimfastC.bmp', 'slimfastV.bmp', 'specialKbar.bmp',
  'strawberries.bmp', 'strussel.bmp', 'uToberlorone.bmp', 'uTwix.bmp', 'wheatcrisps.bmp',
  'whitegrapes.bmp', 'wwbrownie.bmp', 'wwmuffin.bmp'
]
stims = stims.slice(0,4)
var health_stims = jsPsych.randomization.shuffle(stims)
var taste_stims = jsPsych.randomization.shuffle(stims)
var decision_stims = []
var reference_stim = ''
var curr_stim = ''
var stim_ratings = {}
for (var s = 0; s < stims.length; s++) {
  stim_ratings[stims[s]] = {}
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'end'
  },
  text: '<div class = centerbox><p class = "center-block-text">Thanks for completing this task!</p><p class = "center-block-text">Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction'
  },
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: 'instruction'
  },
  pages: [
    "<div class = centerbox><p class = 'block-text'>In this task you will be rating different food items based on their tastiness and healthiness. You have to respond within 4 seconds of the food item being presented, which should be plenty of time. The whole task should not take more than 10 minutes.</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
  timeline: instruction_trials,
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var start_health_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_health'
  },
  text: '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the healthiness of each food item without regard for its taste. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var start_taste_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'start_taste'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the taste of each food item without regard for its healthiness. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var setup_block = {
  type: 'call-function',
  data: {
    trial_id: 'setup test'
  },
  func: setUpTest,
  timing_post_trial: 0
}

var start_decision_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'decision_text'
  },
  text: getDecisionText,
  cont_key: [13],
  timing_post_trial: 500
};


var fixation_block = {
  type: 'poldrack-single-stim',
  // stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  is_html: true,
  timing_stim: 300,
  timing_response: 300,
  data: {
    trial_id: 'fixation'
  },
  choices: 'none',
  response_ends_trial: true,
  timing_post_trial: 1000
}

var health_block = {
  type: 'single-stim-button',
  // stimulus: getHealthStim,
  stimulus: getHealthStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim-health_rating',
    exp_stage: 'test'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var numeric_rating = healthy_responses.indexOf(data.mouse_click) - 2
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'coded_response': numeric_rating
    })
    stim_ratings[curr_stim].health = numeric_rating
  }
}

var taste_block = {
  type: 'single-stim-button',
  // stimulus: getTasteStim,
  stimulus: getTasteStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim-taste_rating',
    exp_stage: 'test'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var numeric_rating = tasty_responses.indexOf(data.mouse_click) - 2
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'coded_response': numeric_rating
    })
    stim_ratings[curr_stim].taste = numeric_rating
  }
}

var decision_block = {
  type: 'single-stim-button',
  stimulus: getDecisionStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim-decision',
    exp_stage: 'test'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var decision_rating = decision_responses.indexOf(data.mouse_click) - 2
    var reference_rating = JSON.stringify(stim_ratings[reference_stim])
    var stim_rating = JSON.stringify(stim_ratings[curr_stim])
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'reference': reference_stim.slice(0, -4),
      'stim_rating': stim_rating,
      'reference_rating': reference_rating,
      'coded_response': decision_rating
    })
  }
}


/* create experiment definition array */
var dietary_decision_experiment = [];
dietary_decision_experiment.push(instruction_node);
if (Math.random() < 0.5) {
  dietary_decision_experiment.push(start_health_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(health_block);
  }
  dietary_decision_experiment.push(start_taste_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(taste_block);
  }
  dietary_decision_experiment.push(attention_node)
} else {
  dietary_decision_experiment.push(start_taste_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(taste_block);
  }
  dietary_decision_experiment.push(start_health_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(health_block);
  }
}
dietary_decision_experiment.push(setup_block);
dietary_decision_experiment.push(start_decision_block);
for (var i = 0; i < stims.length - 1; i++) {
  dietary_decision_experiment.push(decision_block);
}
dietary_decision_experiment.push(end_block);