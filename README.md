# web application hacking

by audrey

this section has 3 levels, plus an intro (level 0). the intro portion is just
reading. it's meant to help beginners. the levels can be done in any order.
level 0 literally tells the user that they can just skip until the end and just
grab the flag

below are the flags, name, descriptions, and hints for each level. there are 
also recommended point values for each flag

since this CTF is for beginners, id recommend making the hints free




--------------------------------------------------------------------------------




## level 0

flag: `CybOrg{lol_n00b}`

name: freebie

description: it's the only flag on level 0. this should be really easy

suggested point value: 10 (or whatever the minimum is)

for this flag, you literally just click to the last page and click a button.
it's given away for free, to encourage people to read the intro




--------------------------------------------------------------------------------




## level 1

flag: `CybOrg{this_can_be_found_by_selecting_with_your_MOUSE}`

name: story time

description: an easy flag for you to get started. you should be able to do this
without touching any code

hint: read the story carefully, and try to decipher the meaning

suggested point value: 25

for this flag, you're supposed to highlight all of the text with your mouse, and
the flag can be revealed, since the highlight changes the colour behind the 
text. alternatively, you can find it by just reading the HTML source code

<br><br>




flag: `CybOrg{Ctrl+F_is_your_friend}`

name: aint nobody got time for that

description: the second story is really long

hint: the flag shouldnt be too hard to <i>find</i>

suggested point value: 25

for this flag, you just go to the story that's linked. it's a text file 
containing the entire bee movie script. the flag is hidden in the middle of the
script on line 914. you're meant te use `[Ctrl + F]` to find it

<br><br>




flag: `CybOrg{google}`

name: external links

description: level 1 contains links to other pages. some of those pages are not
owned by cyborg. can you guess what the files are for? which company owns the 
data? the name of the company is the flag (all lowercase, no spaces)

hint: dont forget that flags should be in the format `CybOrg{abc}`, where `abc`
is the name of the company

suggested point value: 25

<br><br>




flag: `CybOrg{straight_from_the_source}`

name: understanding HTML

description: another easy flag

hint: see if you can use what you learnt from level 0

suggested point value: 25

this can be found in an HTML comment at the bottom of the page

<br><br>




flag: `CybOrg{css_09}`

name: CSS mania

description: check the CSS

hint: some CSS rules are there to trick you. and sometimes, multiple rules apply
to the same HTML element. did you check the spelling? which rule takes 
precedence?

hint: there's an easy way to do this, and a hard way. if it feels really
difficult, you're doing it the hard way

suggested point value: 75

for this, you need to read the HTML and CSS. you need to identify the song list
for the song that's different from the rest. the song is "follow the yellow 
brick road", since the artist is listed as "ozard of wiz". the rest of the songs
have the correct artist name. then you need to figure out which CSS rule is
giving it its colour. there's multiple tags called "yellow" and multiple called
"gold". CSS specifies that the most specific selector wins, so the selector
`ol > li.gold` wins. you can either read a bunch of documentation CSS and try to
figure it out manually, or use the browser's CSS inspector to see which one has
the highest precedence. the browser will ignore all irrelevant CSS rules for 
that element too

<br><br>




--------------------------------------------------------------------------------




## level 2

flag: `CybOrg{galaga_hax}`

name: game hacking

description: hack the game to win the flag! don't cheat! read the instructions!

suggested point value: 100

there's a variety of ways to win this. you can set the enemy's HP to 0, set
their regeneration to a negative value, freeze them in place and disable their
ability to shoot while you kill them, make a single shot from the player cause
over 100 HP damage, etc




--------------------------------------------------------------------------------




## level 3

`CybOrg{pw_cracking_1337}`

name: javascript password cracking 1

description: crack the password with javascript!

suggested point value: 75

should be doable with a simple for-loop

<br><br>




`CybOrg{pw_cracking_0914}`

name: javascript password cracking 2

description: crack the password with javascript!

suggested point value: 100

should be doable with a simple for-loop. only difference here is that some 
people might forget the leading 0

