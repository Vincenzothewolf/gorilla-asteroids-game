{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const config = \{\
  type: Phaser.AUTO,\
  width: 800,\
  height: 600,\
  physics: \{\
    default: 'arcade',\
    arcade: \{\
      debug: false\
    \}\
  \},\
  scene: \{\
    preload: preload,\
    create: create,\
    update: update\
  \}\
\};\
\
const game = new Phaser.Game(config);\
let player, cursors, videotapes, enemies, moneyBills, livesText, scoreText, levelText;\
let score = 0;\
let lives = 3;\
let level = 1;\
\
function preload() \{\
  this.load.image('gorilla', 'assets/gorilla.png');\
  this.load.image('videotape', 'assets/videotape.png');\
  this.load.image('enemy', 'assets/enemy.png');\
  this.load.image('moneyBill', 'assets/moneyBill.png');  // Add your money/bill sprite here\
\}\
\
function create() \{\
  player = this.physics.add.sprite(400, 300, 'gorilla');\
  player.setCollideWorldBounds(true);\
\
  cursors = this.input.keyboard.createCursorKeys();\
\
  videotapes = this.physics.add.group(\{\
    key: 'videotape',\
    repeat: 10,\
    setXY: \{ x: 12, y: 0, stepX: 70 \}\
  \});\
\
  enemies = this.physics.add.group();\
  spawnEnemies.call(this);\
\
  moneyBills = this.physics.add.group();\
\
  this.physics.add.collider(videotapes, enemies, hitEnemy, null, this);\
  this.physics.add.collider(player, moneyBills, hitByMoneyBill, null, this);\
\
  livesText = this.add.text(16, 16, 'Lives: 3', \{ fontSize: '32px', fill: '#fff' \});\
  scoreText = this.add.text(16, 64, 'Score: 0', \{ fontSize: '32px', fill: '#fff' \});\
  levelText = this.add.text(16, 112, 'Level: 1', \{ fontSize: '32px', fill: '#fff' \});\
\}\
\
function update() \{\
  if (cursors.left.isDown) \{\
    player.setVelocityX(-160);\
  \} else if (cursors.right.isDown) \{\
    player.setVelocityX(160);\
  \} else \{\
    player.setVelocityX(0);\
  \}\
\
  if (cursors.up.isDown) \{\
    player.setVelocityY(-160);\
  \} else if (cursors.down.isDown) \{\
    player.setVelocityY(160);\
  \} else \{\
    player.setVelocityY(0);\
  \}\
\
  if (Phaser.Input.Keyboard.JustDown(cursors.space)) \{\
    shootVideotape.call(this);\
  \}\
\
  if (enemies.countActive(true) === 0) \{\
    nextLevel.call(this);\
  \}\
\
  if (lives <= 0) \{\
    checkHighScore(score);\
    this.scene.restart();\
    score = 0;\
    lives = 3;\
    level = 1;\
  \}\
\}\
\
function shootVideotape() \{\
  const videotape = videotapes.get(player.x, player.y);\
  if (videotape) \{\
    videotape.setActive(true);\
    videotape.setVisible(true);\
    videotape.setVelocityY(-300);\
  \}\
\}\
\
function spawnEnemies() \{\
  for (let i = 0; i < level * 5; i++) \{\
    const x = Phaser.Math.Between(0, 800);\
    const y = Phaser.Math.Between(0, 600);\
    const enemy = enemies.create(x, y, 'enemy');\
    enemy.setCollideWorldBounds(true);\
    enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));\
\
    // Each enemy will shoot money/bills at intervals\
    this.time.addEvent(\{\
      delay: Phaser.Math.Between(1000, 3000),\
      callback: shootMoneyBill,\
      callbackScope: this,\
      loop: true,\
      args: [enemy]\
    \});\
  \}\
\}\
\
function shootMoneyBill(enemy) \{\
  const moneyBill = moneyBills.create(enemy.x, enemy.y, 'moneyBill');\
  moneyBill.setCollideWorldBounds(true);\
  this.physics.moveToObject(moneyBill, player, 200);\
\}\
\
function hitEnemy(videotape, enemy) \{\
  videotape.disableBody(true, true);\
  enemy.disableBody(true, true);\
  score += 10;\
  scoreText.setText('Score: ' + score);\
\}\
\
function hitByMoneyBill(player, moneyBill) \{\
  moneyBill.disableBody(true, true);\
  lives -= 1;\
  livesText.setText('Lives: ' + lives);\
\}\
\
function nextLevel() \{\
  level += 1;\
  if (level > 7) \{\
    // Reset to level 1 if you want to loop the levels\
    level = 1;\
  \}\
  levelText.setText('Level: ' + level);\
  spawnEnemies.call(this);\
\}\
\
// High score functionality\
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];\
const maxHighScores = 5;\
\
function checkHighScore(score) \{\
  const lowestHighScore = highScores[maxHighScores - 1]?.score ?? 0;\
\
  if (score > lowestHighScore) \{\
    const name = prompt('You got a high score! Enter your name:');\
    const newScore = \{ score, name \};\
\
    highScores.push(newScore);\
    highScores.sort((a, b) => b.score - a.score);\
    highScores = highScores.slice(0, maxHighScores);\
\
    localStorage.setItem('highScores', JSON.stringify(highScores));\
  \}\
\}\
\
// Display high scores\
function displayHighScores() \{\
  const highScoresText = this.add.text(16, 160, 'High Scores:', \{ fontSize: '32px', fill: '#fff' \});\
  highScores.forEach((score, index) => \{\
    this.add.text(16, 200 + index * 40, `$\{index + 1\}. $\{score.name\} - $\{score.score\}`, \{ fontSize: '32px', fill: '#fff' \});\
  \});\
\}\
\
displayHighScores.call(this);\
}