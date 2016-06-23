var draggingMatch;

var byteMapping = [119, 3, 62, 31, 75, 93, 125, 19, 127, 95];
    
var displayMapping = [
    {
        left: ['top', 'bottom'],
        center: ['top', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        right: ['top', 'bottom']
    },
    {
        left: ['bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['top']
    },
    {
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['center'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['top', 'center', 'bottom'],
        right: ['bottom']
    },
    {
        left: ['top', 'bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['bottom']
    },
    {
        center: ['top'],
        right: ['top', 'bottom']
    },
    {
        left: ['top', 'bottom'],
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    },
    {
        left: ['top'],
        center: ['top', 'center', 'bottom'],
        right: ['top', 'bottom']
    }
];

function digit(d){
    var res = [];
    d=""+d;
    var counter=0;
    while(counter<d.length){
        var digit = $('.digit.etalon').clone();
        digit.removeClass('etalon');
        var keys = Object.keys(displayMapping[d.charAt(counter)]);
        $.each(keys, function(index, column){
            $.each(displayMapping[d.charAt(counter)][column], function(i, match){
                digit.find('.'+column).find('.'+match).removeClass('invisible');
            });
        });
        digit.attr('matches', byteMapping[d]);
        res.push(digit);
        ++counter;
    }
    return res;
};

function sign(sign){
    var res = $('.sign.etalon').clone();
    res.removeClass('etalon');
    if(sign)res.addClass('plus');
    else res.addClass('minus');
    return res;
}

function equalsSign(){
    var equals = $('.equals.etalon').clone();
    equals.removeClass('etalon');
    return equals;
}

function generate(){
    var equation = [];
    var sign = Math.floor((Math.random() * 2));
    equation[1] = sign;
    if(sign){
        equation[0] = Math.floor((Math.random() * 9)+1);
        equation[2] = Math.floor((Math.random() * 9)+1);
        equation[3] = equation[0] + equation[2];
    }else{
        equation[2] = Math.floor((Math.random() * 9)+1);
        equation[3] = Math.floor((Math.random() * 9)+1);
        equation[0] = equation[2] + equation[3];
    }
    return equation;
}

function distance(a, b){
    var distance=0;
    for(var i=0;i<7;i++){
        if(((1<<i)&a)!=((1<<i)&b))++distance;
    }
    return distance;
}

function transition(d){
    $.each(byteMapping, function(i, v){
        console.log(i+": "+distance(byteMapping[i], byteMapping[d]));
    });
}

$( window ).load(function(){
    var equation = generate();
    var body = $('body');
    body.mouseup(function(){
        console.log("mouse up");
        if(draggingMatch){
            draggingMatch.removeClass('invisible');
        }
        $('.droparea').removeClass('droparea');
    });
    body.append(digit(equation[0])).append(sign(equation[1])).append(digit(equation[2])).append(equalsSign()).append(digit(equation[3]));
//    for(var i=0;i<10;i++)body.append(digit(i));
    $('.left > div, .center > div, .right > div').on('mousedown', function(){
        draggingMatch = $(this);
        draggingMatch.addClass("invisible");
        $('.invisible').addClass('droparea');
        $('.droparea').mouseup(function(e){
            e.preventDefault();
            $(this).removeClass('invisible');
            $(this).closest('.digit').attr('matches', draggingMatch.closest('.digit').attr('matches') &(1<<draggingMatch.attr('position')));
            draggingMatch.closest('.digit').attr('matches', draggingMatch.closest('.digit').attr('matches') &~(1<<draggingMatch.attr('position')));
            draggingMatch = null;
            $('droparea').removeClass('droparea');
        });
    });
});



/*

Digit object

*/

var Digit = {
  digit: 0,
   repersentation: function(){
       var result;
       
       switch(this.digit){
           case 0:
               result = [1,1,1,0,1,1,1];
               break;
           case 1:
               result = [0,1,0,0,1,0,0];
               break;
            case 2:
               result = [1,0,1,1,1,0,1];
               break;
           case 3:
               result = [1,1,0,1,1,0,1];
               break;
           case 4: 
               result = [0,1,0,1,1,1,0];
               break;
           case 5:
               result = [1,1,0,1,0,1,1];
               break;
           case 6:
               result = [1,1,1,1,0,1,1];
               break;
           case 7:
               result = [0,1,0,0,1,0,1];
               break;
           case 8:
               result = [1,1,1,1,1,1,1];
               break;
           case 9:
               result = [1,1,0,1,1,1,1];
               break;
           default:
               result = [0,0,0,0,0,0,0];
               break;      
       }
       
       return result;
   },
    set:function(d){
        this.digit = d;
    }
    
};

function Digit(n){
   this.digit = parseInt(n); 
}

/*

Number object


*/

var Number{
    value:0,
    digits:[],
     getDigits: function(n){
         //todo
     },
    update:function(){
        
    }     
}

function Number(n){
    this.value = n;
    this.digits = getDigits(n);
}

/*

Sign object

*/

var Sign={
    sign:'-',
    compute:function(a,b){
        return a-b;
    }
}

function Sign(sign,compute){
    this.sign = sign;
    this.compute = compute;
}

var plus = new Sign("+",function(a,b){return a+b;});
var minus = new Sign("-",function(a,b){return a-b;})


/*

Variant object

*/


var Variant = {
    numbers:[],
    signs:[],
    result: new Number(0)
};



function Variant(numbers,dim,steps){
    var res = 0;

    
    for(var i = 0; i < numbers, i++){ 
        numbers.push(new Number( Math.floor(Math.random()*Math.pow(10,dim)))); 
    }
    
    for(var i = 0; i < numbers-1, i++){
        signs.push((Math.floor(Math.random()*10)%2==1?plus,minus);
    }
    
    this.result = new Number(getResult);               
     
    shuffle(steps); 
                   
    function getResult(){
            var res = numbers[0].value;
            
            for(var i = 1; i < numbers, i++)
                res = signs[i-1].compute(res,numbers[i].value);
            return res;
        }               
                   
        
    function shuffle(n){
        for(var i = 0; i < n; i++){
//            var n1 = numbers[Math.floor(Math.random()*10)%numbers];
//            var d1 = n1.digits[Math.floor(Math.random()*10)%n1.digits.length];
//            var n2 = numbers[Math.floor(Math.random()*10)%numbers];
//            var d2 = n2.digits[Math.floor(Math.random()*10)%n2.digits.length];
            
            if(Math.floor(Math.random()*10)%2){
                //digits
                    var n1 = numbers[Math.floor(Math.random()*10)%numbers];
                    var d1 = n1.digits[Math.floor(Math.random()*10)%n1.digits.length];
                    var actions = getDigitActions(d);
                    var action = actions[Math.floor(Math.random()*10)%actions.length];
                    
                    
                    if(action.turn != undefined){
                        d1.set(action.turn);
                        
                    }else if(action.shift != undefined){
                        d1.set(action.shift);
                        
                    }else if(action.add != undefined){
                    
                    }
                    
                    
                    n1.update;
            }else{
                //signs
                
            }
            
        }
        
        
    }
                    
   
                    
    function findDigit(d){
                    
    }                
    
    function getDigitActions(digit){
        var res = [];
                    
        switch(digit.digit){
            case 0:
                res = [{add:8}, {shift:6},{shift:9}];    
                break;
            case 1: 
                res = [{add:7}];
                break;
            case 2:
                res = [{turn:5},{shift:3}];
                break;    
            case 3:     
                res = [{shift:2},{shift:3}];
                break;    
            case 4:  
                res = [{no:4}];
                break;    
            case 5:
                res = [{turn:2},{shift:3}];
                break;
            case 6:
                res = [{add:8},{turn:9},{shift:0}];  
                break;
            case 7:    
                res = [{remove:1}];  
                break;
            case 8: 
                res =  [{remove:0},{remove:6},{remove:9}];
                break;
            case 9: 
                res = [{add:8},{turn:6},{shift:0}];    
        }            
         return res;           
    }
                    
    function getDigitbyAction(action){
        if(action === 'add')           
    }                
                    
                    
    function getSignActions(sign){
        if (sign.sign === '-') return {add:plus};
        else return {remove:minus};
    }                
}


                    
/*

Game object

*/

var Game={
    variants:[],
    totalVariants:0
};


/*

var game = [
    {levels:20,numbers:3,dim:2,steps:3}
    {levels:15,numbers:3,dim:3,steps:5}
    {levels:15,numbers:4,dim:3,steps:8}
    {levels:10,numbers:4,dim:4,steps:12}
    ];



*/
function Game(game){
    
    for(var i = 0; i < game.length; i++){
        
        this.variants.push([]);
        
        for(var j = 0; j < game[i].levels; j++){
            this.variants[i].push(new Variant(game[i].numbers,game[i].dim,game[i].steps));
            this.totalVariants++;
        }
            
    }
}






