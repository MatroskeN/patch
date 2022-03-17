jQuery(document).ready(function () {

    // **** VARIABLES ***

    // Variable to track the current step
    let step = 1;

    // Data to be stored and used throughout
    let profilerData = {
        gift: null,
        path: 'generic',
        identity: null,
        personalityType: null
    };

    // Number of cards picked throughout the process
    let cardsPicked = 0;

    // Number of cards picked on the current question. Cannot excede 2
    let cardsThisQ = 0;

    // Number of fragrance cards picked. Cannot excede 2
    let fragCardsPicked = 0;
 
    // Tracks active fragrance card and loads relevant content
    let activeFragCard;

    //link to card
    let activeLink;
 
    // Selected Fragrance cards will be stored in this Array
    let fragCardArray = [];
 
    // All selected personality cards + hat, garnish and spirit animal will be stored in this array
    let cardData = [];
 
    // Tracks current score
    let score = 0;

    // Chaecks is the popup that is interacted with is hats or garnishes. 
    let hatOrGarnish;
    
    // Used to prevent double clicks causing errors before an element has fully faded out.
    let clickcount = 0;

    // Is first fragrance card slot empty? 
    let firstEmpty = true;

    let fragClickCount = 0;

    // *** FUNCTIONS ***

    // Fades in the cards in the results section
    cardAnimation = function(){
        $('.card-slot img').animate({
            opacity: 1,
        },500);
    };

    // Progress to the next step. 
    nextStep = function(){

        // Resets selected cards on question variable to 0
        cardsThisQ = 0;

        clickcount = 0;

        fadeSpeed = 500;

        // Change fade speed for step 3
        if (step == 3) {
            if ($(window).width() < 484 ) {
                fadeSpeed = 1000;  
            }
        }
        
        
        else {
            fadeSpeed = 500;
        }

        // Disable button after click to prevent double click and skipping mulitple steps
        $(`.${profilerData.path}.step-${step} .next-step`).attr('disabled', true); 

        
        // Fade out current step
        $(`.${profilerData.path}.step-${step}`).fadeOut(fadeSpeed, function(){
            
            // Specific actions to perfom on certain steps. 
            
            // Switch to generic path after leaving these steps
            if (step === 4) {
                profilerData.path = 'generic';
            }

            // Switch back to chosen identity path after leaving this
            else if (step === 5) {
                profilerData.path = profilerData.identity
            }

            // Swith path to generic if on step 8 - Garnishes. Also change start over text colour
            else if (step === 8) {
                profilerData.path = 'generic';
                $('#start-over').addClass('darktext');
            }

            else if (step === 9) {
                $('#start-over').removeClass('darktext');
            }

            else if (step === 11) {
                $('#start-over').fadeOut(500);
            }
            else if (step == 12) {
                $('#start-over').fadeIn(500);
            }
           
            // Fade in next step
            $(`.${profilerData.path}.step-${step+1}`).fadeIn(500, function(){

                // Increase current step value by one.
                step ++;

                // Fade in card results section and 'Start over' link on first question
                if (step === 4) {
                    $('.personality-results').fadeIn(500);
                    $('#start-over').fadeIn(500);    
                }
 
                // Results not displayed after this point and can be hidden
                else if (step === 9){
                    $('.personality-results').hide();
                }
                
                
                // Fragrance results displayed from this point on.
                else if (step === 13) {
                    $('.fragrance-results').fadeIn(500);
                }

            });

            // Remove unpick event handler from previous steps. User can only remove picks from the current step.  
            $(`.personality-results .card-slot.card-slot${step}`).off();

            // Shows first slide when panel opens
            $('.card-container').slick('slickGoTo', 0);
            $('.fragrance-carousel').slick('slickGoTo', 0);
            $('.card-container .card-2').removeClass('faded');
        }); 

        $('html, body').animate({ scrollTop: 0 }, 500);

    };

    // Go back to the previous step. 
    previousStep = function(){
        $(`.${profilerData.path}.step-${step}`).fadeOut(500, function(){
            $(`.${profilerData.path}.step-${step-1}`).fadeIn(500, function(){
                step --;
            });
        });
        
    };

    // Increase personality card count by one
    increaseCard = function(){
        cardsPicked ++;
    };

    // Increase fragrance card count by one
    increaseFragCard = function(){
        fragCardsPicked ++;
    };

    // Allow Full screen on mobile
    
    $(`#start`).on('click', function(){
        $(`#fragrance-profiler`).addClass(`mobile-full-screen`);
    });

    $(`.close-full-screen`).on(`click`, function(){
        $(`#fragrance-profiler`).removeClass(`mobile-full-screen`);
    });

    // Detect Orientation change and refresh slider
    
    window.addEventListener("orientationchange", function() {
       
        if ( $(window).width() < 824 && $(window).height() < 412) {
            $('.card-container').slick('refresh');
        }
        
      });

      let genClick = 0;  

    // Move to next step on click. Applied to next buttons throughout
    $(`.next-step`).on('click', function(){

        if (step === 3) {
            
            if (genClick === 0) {
                genClick++;
                nextStep();
            }
            
        }
        else {
            nextStep();
        }   

    });

    // Is this a gift or for me. Store data
    $('.choice').on('click', function(){
        $('.choice').off('click');
        profilerData.gift = $(this).data('name');
        nextStep();
        if (profilerData.gift == 'not_gift') {
            $(`.gift-text`).hide();
        }
        else if (profilerData.gift == 'gift') {
            $(`.for-me-text`).hide();
        }
    });

    // Panel 3 - Animate Lady, Gent or It matters not picker
    $('.youare-overlay.select-imn').on('hover touchstart', function(){
        $('.pointer').removeClass('lady-animate');
        $('.pointer').addClass('it-matters-not-animate');
        document.getElementById('youare-picker').innerHTML = `<img src="images/step-3-picker-imn.png">`;
    });
    $('.youare-overlay.select-lady').on('hover touchstart', function(){
        $('.pointer').removeClass('it-matters-not-animate');
        $('.pointer').addClass('lady-animate');
        document.getElementById('youare-picker').innerHTML = `<img src="images/step-3-picker-lady.png">`;
    });
    $('.youare-overlay.select-gent').on('hover touchstart', function(){
        $('.pointer').removeClass('lady-animate').removeClass('it-matters-not-animate');
        document.getElementById('youare-picker').innerHTML = `<img src="images/step-3-picker-gent.png">`;
    });

    // Select Identity and path. Identity will not change but path will switch back and forth to generic throughout the process.
    $('.youare-overlay').on('click', function(){
        profilerData.path = $(this).data('name');
        profilerData.identity = $(this).data('name');
        nextStep();
    });
    
    // Step 4,5,6,8 - Personality cards
    $('.question .playing-cards .card-img').on('click', function(){

        if($(this).hasClass('selected-card-slider')){
            $('.card-container').slick('slickNext');
            clickcount = 0;    
        }

        else {
            clickcount++;
            if (clickcount == 1) {

                // If less than 2 cards have been selected run the following code ...
            
                if (cardsThisQ < 2) {
    
                // For desktop fade out the image...
                if ($(window).width() > 484) {
                    $(this).fadeOut(500, function(){
                        clickcount = 0;
                    });    
                }
        
           // ... for mobile when the display is a slider, fade out the parent element.
           
           else {
            //$('.card-container').slick('slickNext');
            clickcount = 0;
            
               $(this).addClass('selected-card-slider');
               $(`.card-container`).slick('slickNext');
           }
        
           cardsThisQ++;
        
           // Fade in 'next' button after the necessary amount of cards have been selected. 
            afterTwo = function(){
               if (cardsPicked == 2 || cardsPicked == 4 || cardsPicked == 6 || cardsPicked == 7 || cardsPicked == 9 || cardsPicked == 10) {
                // Desktop   
                $(`.${profilerData.path}.step-${step} .hidden-button`).show();
                $(`.${profilerData.path}.step-${step} .button-container`).fadeIn(500);
                $(`.${profilerData.path}.step-${step} .card-container .card-2`).addClass('faded');
                $(`.${profilerData.path}.step-${step} .card-container .slick-current`).addClass('slick-current-original');
                $(`.${profilerData.path}.step-${step} .card-container`).slick('slickGoTo', 1);
                $(`.instruction`).hide();
                if ($(window).height() < 750 && $(window).width() > 499 ) {
                    $('html, body').animate({ scrollTop: 300 }, 500);    
                } 
            } 
               else if  (cardsPicked == 1 || cardsPicked == 3 || cardsPicked == 5 || cardsPicked == 6 || cardsPicked == 8 ) {
                $(`.instruction`).fadeIn(500);
               }
            }
        
           // Get card image source. This can now be displayed in the results panel at the bottom and in the display of all chose cards in step 11
           let chosenCard =  jQuery(this).attr('src');
        
           // Get the score of the selected card.
           let cardScore = $(this).data('score');
           
           // Add to score
           score = score + cardScore;
        
        
           // Add card to results
           document.getElementById(`card${cardsPicked + 1}`).innerHTML = `<img src="${chosenCard}">`;
        
           // Animation. Fade in effect
           cardAnimation();
        
           // Adds chosen cards to array
           cardData[cardsPicked] = jQuery(this).data('name');
           
           // Increase card count by one
           increaseCard();
        
           // See function on line 184
           afterTwo();
        
           $(this).parent().addClass(`picked-card-${cardsPicked}`);
        
                }
        
                // ... else display the error message
                else {
                    $('#question-error').fadeIn(500);
                    clickcount = 0;   
                }   
            }
    
        }
        
    });

    removal = function(){
        if ($(window).width() > 484) {
            $(`.playing-cards.picked-card-${cardsPicked} .card-img`).css({
                'display' : 'block !important'
            });
            $(`.playing-cards.picked-card-${cardsPicked}`).removeClass(`picked-card-${cardsPicked}`);
        }

        else {
            $(`.playing-cards.picked-card-${cardsPicked} .card-img`).removeClass('selected-card-slider');
            $(`.playing-cards.picked-card-${cardsPicked}`).css({
                'display' : 'block !important'
            });
            $(`.playing-cards.picked-card-${cardsPicked}`).removeClass('picked-card-1 picked-card-2');
            $('.card-container .card-2').removeClass('faded');
            $('.card-container').slick('slickGoTo', 0);
            $(`.${profilerData.path}.step-${step} .button-container`).hide();
            $(`.${profilerData.path}.step-${step} .card-container .slick-slide`).removeClass('slick-current-original');
        }
        
        $(`.${profilerData.path}.step-${step} .hidden-button`).fadeOut(500);
        document.getElementById(`card${cardsPicked}`).innerHTML = ``;
        cardsPicked --;
        cardsThisQ --;
        cardData.pop();
    };

    // Cancel card choice  
    $(`.personality-results .card-slot`).on('click', function(){
        removal();
    });
    
   // Step 7 & 9 - hat & garnish
   $('.extra').on('click', function(){

        let extraName = jQuery(this).data('name');
        
        hatOrGarnish = $(this).attr('class');

        if (clickcount == 0) {
            clickcount ++;

            // Centre the selected element after it has been chosen
        $(this).parent().addClass('margin-auto');    

        if (hatOrGarnish == 'extra hat') {
            // Add to results
            document.getElementById('card7').innerHTML = `<img src="images/${extraName}.png">`;

            // Hide images that have not been selected
            $(`.extra.hat`).not(this).parent().hide(); 
            
        }
        else if (hatOrGarnish == 'extra garnish') {
            // Add to results
            document.getElementById('card10').innerHTML = `<img src="images/${extraName}.png">`;

            // Hide images that have not been selected
            $(`.extra.garnish`).not(this).parent().hide(); 

            // Hide bartender image
            $(`.bartender`).hide();
        }

        /* Hat/Garnish will not contribute to score on web version
         score = score + extraScore;
         */

        cardAnimation();

        cardData[cardsPicked] = jQuery(this).data('name');

        increaseCard();

        // Fade in hidden button
        $(`.${profilerData.path}.step-${step} .hidden-button`).fadeIn(500);

        // Change text after selection
        $(`.${profilerData.path}.step-${step} .question-text`).toggle();
       
        }
    
   });
   
   // Wheel animation
    let wheel = $("#wheel");

    // Center it and get the transform properties
    TweenLite.set(wheel, { xPercent: -50, yPercent: -50 });
    let transform = wheel[0]._gsTransform;

function initWheel()
{
  myDraggable = Draggable.create(wheel, {
    type: "rotation",
    minDuration:5,
    maxDuration:5,
    minimumMovement: 10,
    throwResistance:0,
    overshootTolerance: 1,
    onDragEnd:function() {
		
        // Get rotation value. Do not edit
        let rotationValue = Math.round(transform.rotation);

        // This variable can be edited
        let adjustedRV = rotationValue;

        // This value will be recalculated if there is more than one turn or if the rotation is anti clockwise
        let reCalculatedRotationValue = rotationValue;
        
        // Calculate The number of turns made
        let turns;

        // Determine is rotation was clockwise or anticlockwise
        let rotationClockwise;

        let spiritAnimal;

        $('#finish').fadeIn(500);


        // Calculate turns if clockwise
        if (rotationValue > 0){
           turns = Math.floor(rotationValue / 360);
        }
        
        // Calculate turns if anti-clockwise
        else {
            turns = Math.ceil(rotationValue / 360);
        }

        // Recalculate value to get the angle 
        
        // Check if the wheel was moved forwards or backwards
        if (rotationValue > 0) {
            rotationClockwise = true;
        }
        else {
            rotationClockwise = false;
        }

        // Adjust negative figures if th wheel was moved anti-clockwise
        if (rotationValue < 0) {
            turns = Math.abs(turns);
            adjustedRV = Math.abs(rotationValue);
            reCalculatedRotationValue = adjustedRV - (turns * 360);
        }
        else {
            reCalculatedRotationValue = rotationValue - (turns * 360);
        }

         /*
         let overlayAngle;
         let roundToAngle = function(value, roundTo) {
             overlayAngle = Math.floor(value / roundTo) * roundTo;
         }
         
         roundToAngle(reCalculatedRotationValue + 10, 45); // => 120
         */
         

        // Display results

        if (rotationClockwise == true) {

        
            if (reCalculatedRotationValue < 25 || reCalculatedRotationValue > 341) {
            
            spiritAnimal = 8;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(0deg)`
            });
           
            }
            else if (reCalculatedRotationValue > 25 && reCalculatedRotationValue < 70) {
           
            spiritAnimal = 1;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(315deg)`
            });
        }
            else if (reCalculatedRotationValue > 70 && reCalculatedRotationValue < 115) {
            
            spiritAnimal = 2;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(270deg)`
            });
            
        }
            else if (reCalculatedRotationValue > 115 && reCalculatedRotationValue < 160) {
           
            spiritAnimal = 3;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(225deg)`
            });
        }
            else if (reCalculatedRotationValue > 160 && reCalculatedRotationValue < 205) {
            
            spiritAnimal = 4;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(180deg)`
            });
        }
            else if (reCalculatedRotationValue > 205 && reCalculatedRotationValue < 250) {
           
            spiritAnimal = 5;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(135deg)`
            });
        }
            else if (reCalculatedRotationValue > 250 && reCalculatedRotationValue < 295) {
           
            spiritAnimal = 6;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(90deg)`
            });
        }
            else if (reCalculatedRotationValue > 295 && reCalculatedRotationValue < 340) {
            
            spiritAnimal = 7;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(45deg)`
            });
        }
    }
        else if (rotationClockwise == false) {

           
            if (reCalculatedRotationValue < 25 || reCalculatedRotationValue > 336) {
            
            spiritAnimal = 8;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(0deg)`
            });
            }
            else if (reCalculatedRotationValue > 20 && reCalculatedRotationValue < 65) {
            
            spiritAnimal = 7;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-315deg)`
            });
        }
            else if (reCalculatedRotationValue > 65 && reCalculatedRotationValue < 110) {
            
            spiritAnimal = 6;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-270deg)`
            });
        }
            else if (reCalculatedRotationValue > 110 && reCalculatedRotationValue < 155) {
            
            spiritAnimal = 5;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-225deg)`
            });
        }
            else if (reCalculatedRotationValue > 155 && reCalculatedRotationValue < 200) {
            
            spiritAnimal = 4;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-180deg)`
            });
        }
            else if (reCalculatedRotationValue > 200 && reCalculatedRotationValue < 245) {
            
            spiritAnimal = 3;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-135deg)`
            });
        }
            else if (reCalculatedRotationValue > 245 && reCalculatedRotationValue < 290) {
            
            spiritAnimal = 2;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-90deg)`
            });
        }
            else if (reCalculatedRotationValue > 290 && reCalculatedRotationValue < 335) {
            
            spiritAnimal = 1;
            $("#result-overlay").css({
                'transform':`translate(-50%, -50%) rotate(-45deg)`
            });
        }
       
        }    
	
         // Add Spirit animal to results
         document.getElementById('card11').innerHTML = `<img src="images/animal-card-${spiritAnimal}.png">`;
         cardData[10] = spiritAnimal;

         // Highlight result
         $('#result-overlay').show();

    },
    
  });
}

initWheel();

    // Panel 13 - Your fragrances
    
    
    $('.your-fragrances .playing-cards .card-img').on('click', function(){
        
        if (fragClickCount === 0) {

            fragClickCount++;

            

            if (fragCardsPicked < 2) {

                activeFragCard = $(this).data('name');
    
                // Load content in popup for selected card.  
    
                
                document.getElementById('bottle-image').innerHTML = `<img src="images/${activeFragCard}-sample.png"/>`;
                document.getElementById('bottle-image2').innerHTML = `<img src="images/${activeFragCard}-bottle.png"/>`;
    
                if (activeFragCard == 'blazingmistersam'){
                    document.getElementById('sample-content').innerHTML = `
                    <div class="row">
                        <div class="col-xs-12">
                            <h2>Blazing Mister Sam</h2>
                            <p>
                                Американец за границей со всей своей дерзкой уверенностью в себе, которую можно от него ожидать. 
                                В его парфюмированной воде горячие и холодные пряные ноты смешиваются с сухим пачули и сливочным кедром. 
                                Никто не может устоять перед чарами Сэма. «Йо-хо!»
                            </p>
                        </div>
                    </div>
                    <div class="row notes">
                        <div class="col-md-4 note">
                            <p>Верхние ноты</p>
                            <p>Кардамон</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Средние ноты</p>
                            <p>Черный перец</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Базовые ноты</p>
                            <p>Кедр</p>
                        </div>
                    </div>
                    
                    `
                }
                else if (activeFragCard == 'cairo') {
                    document.getElementById('sample-content').innerHTML = `
                    <div class="row">
                        <div class="col-xs-12">
                            <h2>Cairo</h2>
                            <p>
                                Солнце, восходящее над Каиром, приносит теплую пряность шафрана. Вскорости все оживает. 
                                Дамасская роза и лабданум вздымаются над чувственным пачули. 
                                Парфюмированная вода, названная в честь этого города, — древняя, но каждый день она рождается заново.
                            </p>
                        </div>
                    </div>
                    <div class="row notes">
                        <div class="col-md-4 note">
                            <p>Верхние ноты</p>
                            <p>Шафран</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Средние ноты</p>
                            <p>Роза</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Базовые ноты</p>
                            <p>Ваниль</p>
                        </div>
                    </div>
                    
                    `
                }
                else if (activeFragCard == 'vaara') {
                    document.getElementById('sample-content').innerHTML = `
                    <div class="row">
                        <div class="col-xs-12">
                            <h2>Vaara</h2>
                            <p>
                                Внучка махараджи, рожденная в роскоши. Сочная айва, ароматные розы и дерево, согретое полуденным солнцем. Яркий Раджастхан, заключенный в парфюмированную воду. Прекрасно гармонирует с величественной элегантностью.
                            </p>
                        </div>
                    </div>
                    <div class="row notes">
                        <div class="col-md-4 note">
                            <p>Верхние ноты</p>
                            <p>Айва</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Средние ноты</p>
                            <p>Масло болгарской розы</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Базовые ноты</p>
                            <p>Сандаловое дерево</p>
                        </div>
                    </div>
                    
                    `
                }
    
                if (fragCardsPicked == 2){
                    $(`.add-to-basket`).fadeIn(500);
                }
                else {
                    $(`.add-to-basket`).fadeOut(500);
                }
                nextStep();
        }
    
        else {
            $('#fragrance-error').fadeIn(500);
            
            }
        }

    });

    $('.fragrance-results .card-slot #fragrance-card1').on('click',function(){
        fragClickCount = 0;
        activeFragCard = $(this).children().data('label');
        document.getElementById('fragrance-card1').innerHTML = '';
        $('.picked-card1 .card-img').css({
            'display': 'block !important'
        });
        $('.picked-card1 .card-img').siblings('.fragcardlinks').fadeIn(500);
        $(`.add-to-basket`).fadeOut(500);
        $(`[data-name="${activeFragCard}"]`).parent().removeClass(`picked-card1`);
        fragCardArray.shift(activeFragCard);
        fragCardsPicked --;
        firstEmpty = true;
    });
    $('.fragrance-results .card-slot #fragrance-card2').on('click',function(){
        fragClickCount = 0;
        activeFragCard = $(this).children().data('label');
        document.getElementById('fragrance-card2').innerHTML = '';
        $('.picked-card2 .card-img').css({
            'display': 'block !important'
        });
        $('.picked-card2 .card-img').siblings('.fragcardlinks').fadeIn(500);
        $(`.add-to-basket`).fadeOut(500);
        $(`[data-name="${activeFragCard}"]`).parent().removeClass(`picked-card2`);

        fragCardArray.pop(activeFragCard);
        fragCardsPicked --;
    });


    $('.add-sample').on('click', function(){

        if (fragClickCount === 1) {
            fragClickCount = 0;

            if (firstEmpty == true){
                $(`[data-name="${activeFragCard}"]`).parent().addClass(`picked-card1`);
                $(`[data-name="${activeFragCard}"]`).parent().removeClass(`picked-card2`);
                document.getElementById(`fragrance-card1`).innerHTML = `<img data-label=${activeFragCard} src="images/${activeFragCard}.png">`;
                document.getElementById(`sample-final1`).innerHTML = `<img src="images/${activeFragCard}.png">`;
                firstEmpty = false;
                fragCardArray.unshift(activeFragCard);
            }
            else if (firstEmpty == false) {
                $(`[data-name="${activeFragCard}"]`).parent().addClass(`picked-card2`);
                $(`[data-name="${activeFragCard}"]`).parent().removeClass(`picked-card1`);
                document.getElementById(`fragrance-card2`).innerHTML = `<img data-label=${activeFragCard} src="images/${activeFragCard}.png">`;
                document.getElementById(`sample-final2`).innerHTML = `<img src="images/${activeFragCard}.png">`;
                fragCardArray.push(activeFragCard);
            }

            $(`[data-name="${activeFragCard}"]`).fadeOut(500);
            $(`[data-name="${activeFragCard}"]`).siblings('.fragcardlinks').fadeOut(500);

            fragCardsPicked ++;
            if (fragCardsPicked == 2) {
                $(`.add-to-basket`).fadeIn(500);
            }

            previousStep();
            cardAnimation();
        }

    });


    // Close fragrance popup. 
    $('.close').on('click', function(){
        if (fragClickCount === 1) {
            fragClickCount = 0;
            
            $(`[data-name="${activeFragCard}"]`).siblings('.fragcardlinks').fadeIn(500);
            previousStep();
            activeFragCard = null;
        }
    });

    $('#finish').on('click', function(){

        nextStep();

       

        // Display all cards on results page (except animal card)
       for (i = 0; i < cardData.length -1; i++) {
        document.getElementById(`resultCard-${i+1}`).innerHTML = `<img src="images/${cardData[i]}.png"></img>`;
       }

        // Animal card for results page
        document.getElementById('resultCard-11').innerHTML = `<img src="images/animal-card-${cardData[10]}.png"></img>`;

        // Animal image for persona pop up
        document.getElementById('animal').innerHTML = `<img src="images/animal-${cardData[10]}.png">`

        let cards = ''
        let dataCards;
        getAroma(profilerData.identity, score).then(res => {
            console.log(res)
            dataCards = res.products;
            res.products.forEach((item) => {
                cards += `
                <div class="col-md-3 col-md-offset-1 col-xs-6 col-xs-offset-3 playing-cards">
                    <img class="card-1 fragrance-card card-img check-data" data-name="${item.data}" src="${item.image}.png">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <p class="fragcardlinks shuffle">Перемешать</p>
                </div>
                `;
            })
            $('.aroma-result').html('').html(cards)
            $('.check-data').on('click', (evt) => {
                let data = evt.target.dataset.name;
                let item = dataCards.filter((item) => item.data === data)
                console.log(item)
                document.getElementById('bottle-image').innerHTML = `<img src="${item[0].image}-sample.png"/>`;
                document.getElementById('bottle-image2').innerHTML = `<img src="${item[0].image}-bottle.png"/>`;
                document.getElementById('sample-content').innerHTML = `
                    <div class="row">
                        <div class="col-xs-12">
                            <h2>${item[0].name}</h2>
                            <p>${item[0].description}</p>
                        </div>
                    </div>
                    <div class="row notes">
                        <div class="col-md-4 note">
                            <p>Верхние ноты</p>
                            <p>Кардамон</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Средние ноты</p>
                            <p>Черный перец</p>
                        </div>
                        <div class="col-md-4 note">
                            <p>Базовые ноты</p>
                            <p>Кедр</p>
                        </div>
                    </div>
                    `;
                document.querySelector('.add-sample').href = item[0].link;
                $(`.add-to-basket`).fadeIn(500);
                nextStep();
            });
        })

        // Load personality content for Gent
        if (profilerData.identity == 'gent') {
            
            if (score <= 15) {
                profilerData.personalityType = 'The Modern Dandy';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="dandy" src="images/gent-persona-card-1.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/gent-persona-card-1.png">
                </div>
                <div class="col-md-7">
                    <h4 class="for-me-text">Вы</h4>
                    <h4 class="gift-text">Он (она)</h4>
                    <h2>СОВРЕМЕННЫЙ ДЕНДИ</h2>
                    <p>
                        Нечего и говорить, что находиться в вашей компании всегда приятно и ох как весело! 
                        Общение с вами — это глоток свежего воздуха для любого общества. 
                        Вас скорее можно заметить на Карнаби стрит в Лондоне, ведь вам по душе более самобытный стиль, а не чопорный, характерный для Севил Роу. 
                        Ваш уникальный и неподражаемый нрав подразумевает, что вы не следуете за толпой. Предсказуемость — это не про вас.
                    </p>
                
                    
                </div>            
            
            `
            }
            else if (score >= 16 && score <= 19){
                profilerData.personalityType = 'The Fearless Fellow';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card2" src="images/gent-persona-card-2.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/gent-persona-card-2.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>БЕССТРАШНЫЙ ПАРЕНЬ</h2>
                    <p>
                        Вы тот, кто все проверяет на практике. К тому же спортсмен, не так ли? Да это ваша вторая натура. Вы весьма амбициозны и совсем не равнодушны к здоровой конкуренции. Все в духе превосходства. Для обид здесь нет места.
                    <br/>
                        Вы упорный малый и, по всей видимости, в вашей безграничной вере в успех ощущается уверенность и элегантность.
                    </p>
                </div>            
            
            `
                
            }
            else if (score >= 20 && score <= 23){
                profilerData.personalityType = 'The 3rd Persona';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card3" src="images/gent-persona-card-3.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/gent-persona-card-3.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>МИСТЕР ГАЛАНТНОСТЬ</h2>
                    <p>Утонченность — ваше второе имя. Вы питаете слабость к компании высокообразованных и стильно одетых людей, к тому же с хорошим коктейлем в руках. Вы знаете толк в изяществе хороших манер и обычаях, принятых в высшем обществе, и, конечно же, приемлите обслуживание только на высшем уровне.
                    <br/>
                    Хоть вы и можете делать привычные вещи по старинке, вы однозначно нацелены на будущее. Традиции в современном исполнении — это стиль вашей жизни.
                    <br/>
                    Для вас всегда найдется укромный уголок и хороший Мартини, приготовленный согласно вашим предпочтениям.
                    </p>
                </div>            
            
            `
            }
            else if (score >= 24){
                profilerData.personalityType = 'The 4th Persona';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card4" src="images/gent-persona-card-4.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                    <div class="col-md-4 col-xs-12 pers-card">
                        <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                        <img class="persona" src="images/gent-persona-card-4.png">
                    </div>
                    <div class="col-md-7">
                    <h4 class="for-me-text">Вы</h4>
                    <h4 class="gift-text">Он (она)</h4>
                        <h2>ЛЮБОПЫТНЫЙ СТРАННИК</h2>
                        <p>Ну надо же, ведь вы само воплощение таинственности! Вас часто описывают как чрезвычайно обаятельную личность, познавшую мир, с великолепными манерами и ноткой экзотичности. 
                        Вы без ума от всего, что связано с искусством, и вы всегда готовы поделиться своими нетривиальными историями.
                        Насколько мы помним, от желающих их услышать нет отбоя.
                        </p>
                    </div>            
                
                `    
            }
        }

        // Load personality content for Lady
        else if (profilerData.identity == 'lady') {
            if (score <= 15) {
                profilerData.personalityType = 'The Modern Dandy Lady';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="dandy" src="images/lady-persona-card-1.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-1.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>Пламенная Душа</h2>
                    <p>Ваше буйное воображение весьма легко разжечь. Это природный талант, и вы знаете, как им пользоваться.
                    Для вас в приоритете духовное богатство, приключения и живое общение. Чужое мнение не помешает вам встретить рассвет в лесу, купаться нагишом в ночи или скакать на дикой лошади под палящим солнцем пустыни.
                    </p>
                </div>            
            
            `
            }
            else if (score >= 16 && score <= 19){
                profilerData.personalityType = 'The Fearless Lady';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card2" src="images/lady-persona-card-2.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-2.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>Идеал Независимости</h2>
                    <p>Вы — та самая женщина, которой мечтает стать любая светская дама: неоднозначная, но одновременно невероятно притягательная личность, которая никого не оставит равнодушным. Вы вдохновляете окружающих не только своей утонченностью, но и взглядом на мир сквозь розовые очки.
                    Вы излучаете харизму, интеллект и элегантность. Ваше чувство стиля и неизменная уверенность в себе не дают Вам отбоя от толп воздыхателей. 
                    </p>
                </div>            
            
            `
                
            }
            else if (score >= 20 && score <= 23){
                profilerData.personalityType = 'The 3rd Lady';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card3" src="images/lady-persona-card-3.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-3.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>ОСЛЕПИТЕЛЬНАЯ ГРАФИНЯ</h2>
                    <p>
                        Кто сказал, что великие женщины должны быть скромными? Обладая остроумием и гениальной проницательностью, вы похожи на гламурную и бесстрашную девушку Бонда!
                    <br/>
                        Будучи повелительницей торжеств и фанфар, вы устраиваете сказочные вечеринки. Ваше любимое слово — «декаданс» или, может быть, «милочка». В любом случае, дорогая, все ваши друзья просто душки.
                    </p>
                </div>            
            
            `
            }
            else if (score >= 24){
                profilerData.personalityType = 'The 4th Lady';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card4" src="images/lady-persona-card-4.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                    <div class="col-md-4 col-xs-12 pers-card">
                        <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                        <img class="persona" src="images/lady-persona-card-4.png">
                    </div>
                    <div class="col-md-7">
                    <h4 class="for-me-text">Вы</h4>
                    <h4 class="gift-text">Он (она)</h4>
                        <h2>ПЬЯНЯЩАЯ ОХОТНИЦА ЗА УДАЧЕЙ</h2>
                        <p>
                        Разъезжаете ли вы по миру в поисках самых экзотичных приключений или просто прогуливаетесь по Лондону, высматривая лучшие напитки, вы отдаете предпочтение наименее оживленным улицам. В конце концов, следовать за толпой это так предсказуемо.
                        <br/>
                        Всегда нужно идти куда вздумается и с кем заблагорассудится. Мы называем это волевой элегантностью.
                        <br/>
                        Вас всегда больше интересовало чтение. Что ж, читать, писать, заниматься спортом, действовать! Ведь беседы за чаем в гостиной не про вас.
                        </p>
                    </div>            
                
                `    
            }
        }

        // Load personality content for It matters not
        else if (profilerData.identity == 'imn') {
            if (score <= 15) {
                profilerData.personalityType = 'The Modern Dandy IMN';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="dandy" src="images/lady-persona-card-1.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-1.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>ОБАЯТЕЛЬНЫЙ РАССКАЗЧИК</h2>
                    <p>
                    Вы весьма энергичны, обладаете острым умом и столь беззаботной и непринужденной красотой. Безусловно, не всем комфортно с тем, кто может легко обыграть, перепить и заговорить на любом светском мероприятии, сохраняя при этом безупречную элегантность, которая может составить конкуренцию даже самому галантному из повес. 
                    <br/>
                    Вы настоящее сокровище. В вас столько отважной силы. И столько дел, зачем попусту терять время.
                    <br/>
                    Пока-пока!
                    </p>
                </div>            
            
            `
            }
            else if (score >= 16 && score <= 19){
                profilerData.personalityType = 'The Fearless IMN';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card2" src="images/lady-persona-card-2.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-2.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>САМА ДОБРОТА</h2>
                    <p>
                    Вы блуждаете в одиночестве словно месяц в небе, но это вовсе не означает, что вам когда-либо бывает тоскливо. Конечно нет! С таким нескончаемым потоком мечтаний вы всегда будете желанным собеседником для самого себя и других. Вам не стоит и минуты, чтобы собраться с мыслями (немногие так же собраны, как вы) и подбодрить собеседника или бросить сочувственный взгляд. 
                    <br/>
                    Размышляя над смыслом жизни, вы мечтаете о стране, где щедрость встречается на каждом шагу. У вас совсем нет времени на тех, кто часто говорит «нет», или на тех, кто похож на персонажа Дориана Грея, ведь ваше великодушие не имеет границ.
                    </p>
                </div>            
            
            `
                
            }
            else if (score >= 20 && score <= 23){
                profilerData.personalityType = 'The 3rd IMN';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card3" src="images/lady-persona-card-3.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                <div class="col-md-4 col-xs-12 pers-card">
                    <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                    <img class="persona" src="images/lady-persona-card-3.png">
                </div>
                <div class="col-md-7">
                <h4 class="for-me-text">Вы</h4>
                <h4 class="gift-text">Он (она)</h4>
                    <h2>СВЕТСКИЙ ЗАТЕЙНИК</h2>
                    <p>
                    Привлекать внимание окружающих для вас так естественно, а почему бы и нет? Вам это свойственно с пеленок, ведь легкомысленность — ваша вторая натура. Где бы вы не появлялись, вы производите фурор, и в этом вам нет равных. Как только ваше окружение начинает веселиться, вы тут же откупориваете бутылочку игристого. 
                    <br/>
                    Вы неравнодушны к джину (с единственным подходящим тоником), хотя вы более чем готовы нарушить традиции, когда дело доходит до яркого украшения напитка. Что-нибудь цитрусовое? Возможно. Лепесток бузины? Это уже перебор, дорогуша. Ах, да, базилик. Вот это то, что надо. Давай еще, на посошок!
                    </p>
                </div>            
            
            `
            }
            else if (score >= 24){
                profilerData.personalityType = 'The 4th IMN';
                document.getElementById('persona-final').innerHTML = `<img class="card card-1 fragrance-card" data-name="card4" src="images/lady-persona-card-4.png">`;
                document.getElementById('persona-content').innerHTML = `
                
                    <div class="col-md-4 col-xs-12 pers-card">
                        <img class="card-bg card-bg-left" src="images/pack-left-v6.png">
                        <img class="persona" src="images/lady-persona-card-4.png">
                    </div>
                    <div class="col-md-7">
                    <h4 class="for-me-text">Вы</h4>
                    <h4 class="gift-text">Он (она)</h4>
                        <h2>Чарующий Незнакомец (или Незнакомка)</h2>
                        <p>
                            Время, проведенное с вами, наполнено приятными открытиями. Вы буквально парите, а ваши глаза излучают таинственный блеск. «Присаживайтесь, — говорите вы, — узнаем друг друга поближе». Но мы-то с вами знаем, что это значит в библейском смысле. Вы выманиваете секреты из людей так же легко, как дудочка управляет змеей. Но вам, впрочем, дудочка и не нужна — достаточно воздушного поцелуя.
                        </p>
                    </div>            
                
                `    
            }
        }
       
        // Delays move to next step for 10 seconds so user can see cards shuffle
        setTimeout(function () {
            nextStep();
            if (profilerData.gift == 'not_gift') {
                $(`.gift-text`).hide();
            }
            else if (profilerData.gift == 'gift') {
                $(`.for-me-text`).hide();
            }
        },5000);

    });

    $('#seeFragrances').on('click', function(){
        nextStep();
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // Skipping 2 steps rather than 1
    $('.add-to-basket').on('click', function(){
        $(`.${profilerData.path}.step-13`).fadeOut(500, function(){
            $(`.${profilerData.path}.step-15`).fadeIn(500, function(){
                step = 15;
            });
        });
    });

   // Reset display and data
   $('#start-over, #start-over-button').on('click',function(){
       $(`.${profilerData.path}.step-${step}`).fadeOut(500, function(){

        step = 1;
        score = 0;
        cardsPicked = 0;
        fragCardsPicked = 0;
        genClick = 0; 
        activeFragCard = null;
        fragCardArray = [];
        cardData = [];
        profilerData.gift = null;
        profilerData.path = 'generic';
        profilerData.identity = null;
        profilerData.personalityType = null;
        firstEmpty = true;
        document.getElementById(`fragrance-card1`).innerHTML = ``;
        document.getElementById(`fragrance-card2`).innerHTML = ``;
        document.getElementById(`sample-final1`).innerHTML = ``;
        document.getElementById(`sample-final2`).innerHTML = ``;
        document.getElementById('card1').innerHTML = ``;
        document.getElementById('card2').innerHTML = ``;
        document.getElementById('card3').innerHTML = ``;
        document.getElementById('card4').innerHTML = ``;
        document.getElementById('card5').innerHTML = ``;
        document.getElementById('card6').innerHTML = ``;
        document.getElementById('card7').innerHTML = ``;
        document.getElementById('card8').innerHTML = ``;
        document.getElementById('card9').innerHTML = ``;
        document.getElementById('card10').innerHTML = ``;
        document.getElementById('card11').innerHTML = ``;
        $(`#fragrance-profiler`).removeClass(`mobile-full-screen`);
        $(`.step-1`).fadeIn(500);
        $('.results').fadeOut(500);
        $('.playing-cards .card-img').fadeIn(500);
        $('.playing-cards .card-img').parent().fadeIn(500);
        $(`.playing-cards .card-img`).removeClass('selected-card-slider');
        $('.playing-cards').removeClass('picked-card-1').removeClass('picked-card-2').removeClass('picked-card-3').removeClass('picked-card-4').removeClass('picked-card-5').removeClass('picked-card-6').removeClass('picked-card-7').removeClass('picked-card-8');
        $('.bartender').fadeIn(500);
        $('.hidden-button').fadeOut(500);
        $('#finish').fadeOut(500);
        $('#result-overlay').fadeOut(500);
        $('.extra').parent().fadeIn(500);
        $('.extra').parent().removeClass('margin-auto');
        $('#start-over').fadeOut(500);
        $(`.add-to-basket`).fadeOut(500);
        $(`.next-step`).attr('disabled', false); 
        $('.pointer').removeClass('lady-animate').removeClass('it-matters-not-animate');
        $(`.question-text`).toggle();
        $('html, body').animate({ scrollTop: 0 }, 500);
        $('#question-error').fadeOut(500);
        if ($(window).width() < 484 ) {
            $('.panel-container .question .button-container').fadeOut(500);
        }
        document.getElementById('youare-picker').innerHTML = `<img src="images/step-3-picker-gent.png">`;
        $(`.personality-results .card-slot`).on('click', function(){
            removal();
        });
        $('.choice').on('click', function(){
            $('.choice').off('click');
            profilerData.gift = $(this).data('name');
            nextStep();
        });
       });
   });
   
   // Close error popup
   $('.closeError').on('click', function(){
       $('.error').fadeOut(500);
   });

   // Slider controls

   $('.card-container').slick({
    centerMode: true,
    centerPadding: '80px',
    slidesToShow: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    mobileFirst: true,
    waitForAnimate: false,
    draggable: true,
    responsive: [
    {
        breakpoint: 499,
        centerPadding: '140px',
        settings: 'unslick'
        }
    ]
});

$('.fragrance-carousel').slick({
    arrows: false,
    infinite: false,
    slidesToShow: 1,
    dots: true,
});




}); 
