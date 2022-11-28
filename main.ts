namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const Garbage = SpriteKind.create()
    export const Fireball = SpriteKind.create()
    export const Player_Attack = SpriteKind.create()
    export const tips = SpriteKind.create()
}
sprites.onCreated(SpriteKind.Enemy, function (sprite) {
    sprite.startEffect(effects.fire, 200)
    timer.after(250, function () {
        sprite.follow(billy, billyMoveSpeed * 0.9)
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`devNoticeSign`, function (sprite, location) {
    if (devTestLevel == 1) {
        sprite.sayText("This is a testing level, please tell the creator if you find yourself here!", 100, false)
    } else {
        sprite.sayText("This is a beta so don't expect high quality. Also, please inform the creator of any bugs that you find.", 100, false)
    }
})
function Update_Test_Bar (check: number) {
    if (devTesting == 1 && check == 1) {
        if (billy.vx == billyMoveSpeed || billy.vx == billyMoveSpeed * -1) {
            varTestingBar.value = 0
        } else if (billy.vx == billy_wall_actions("wallFlingVX", "Right") || billy.vx == billy_wall_actions("wallFlingVX", "Left") * -1) {
            varTestingBar.value = 1
        } else {
            varTestingBar.value = 0
        }
    }
}
function set_place_hold_vars () {
    fallSpeed = 200
    billyJumpHeight = -140
    billyMoveSpeed = 100
    billyMaxEnergy = 20
    billyEnergyDrain = -4
    billyEnergyGain = 1
    billyMaxHealth = 5
    billyMaxMagic = 3
    billyBulletDamage = -5
    bulletSpeed = 60
    bulletAcceleration = bulletSpeed / 2
    billyStompDamage += -10
    coinScoreGive = 1
    bugScoreGive = 3
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    info.changeScoreBy(coinScoreGive)
    otherSprite.destroy()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikeTile`, function (sprite, location) {
    game.over(false, effects.dissolve)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (billyMagicBar.value > 0) {
        billyAttack = sprites.create(assets.image`billyBullet`, SpriteKind.Player_Attack)
    } else if (billyMagicBar.value > 3) {
        music.baDing.play()
    } else {
        music.zapped.play()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (billy.vy == 0) {
        if (billyOnWall == 0) {
            billy.vy = billyJumpHeight
        } else if (wallTileCheck("right") == 1 && billy.isHittingTile(CollisionDirection.Right) || wallTileCheck("left") == 1 && billy.isHittingTile(CollisionDirection.Left)) {
            if (billyJumpOrFlingOfWall == 0) {
                billyJumpOrFlingOfWall = 1
                billy.vy = billy_wall_actions("wallJumpVY", "Up")
                if (billy.isHittingTile(CollisionDirection.Right)) {
                    billy.vx = billy_wall_actions("wallJumpVX", "Left")
                    pause(200)
                    while (billy.vx < 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                        billy.vx += billy_wall_actions("wallJumpDecay", "Left")
                        for (let index = 0; index < 2; index++) {
                            if (billy.vx < 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                                pause(100)
                            }
                            if (wallTileCheck("down") == 1 && billy.isHittingTile(CollisionDirection.Bottom) || !(billy.vx < 0) && !(controller.right.isPressed())) {
                                if (controller.left.isPressed()) {
                                    billy.vx = billyMoveSpeed * -1
                                } else {
                                    billy.vx = 0
                                }
                            }
                        }
                    }
                } else if (billy.isHittingTile(CollisionDirection.Left)) {
                    billy.vx = billy_wall_actions("wallJumpVX", "Right")
                    pause(200)
                    while (billy.vx > 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                        billy.vx += billy_wall_actions("wallJumpDecay", "Right")
                        for (let index = 0; index < 2; index++) {
                            if (billy.vx > 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                                pause(100)
                            }
                            if (wallTileCheck("down") == 1 && billy.isHittingTile(CollisionDirection.Bottom) || !(billy.vx > 0) && !(controller.left.isPressed())) {
                                if (controller.right.isPressed()) {
                                    billy.vx = billyMoveSpeed
                                } else {
                                    billy.vx = 0
                                }
                            }
                        }
                    }
                }
                billyJumpOrFlingOfWall = 0
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`Sign`, function (sprite, location) {
    sprite.sayText("(press up to interact)", 100, false)
    if (currentLevel == 0) {
        if (controller.up.isPressed()) {
            game.splash("Hello friend, I am Billy!", "It is time to learn how to play!")
            game.splash("press left/right to move, ", "press 'A' to jump, ")
            game.splash("press 'B' to fire a bullet,", "and press up to interact")
            game.splash("you can stomp on the bugs,", "or hit them with 2 shots")
            game.splash("that's all, have fun!")
        }
    } else if (currentLevel == 1) {
        if (controller.up.isPressed()) {
            game.splash("do you know you can:", "wall-jump and wall-fling?")
            game.splash("press 'A' when I'm on", "a wall to walljump")
            game.splash("walljumps give more height", "but less left/right speed")
            game.splash("press the direction opposite", "to the wall I'm on on to wallfling")
            game.splash("wallflings give less height", "but more left/right speed")
            game.splash("if I'm sliding down a wall", "press down to make me slide faster")
        }
    } else {
    	
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`exitPortalTile`, function (sprite, location) {
    currentLevel += 1
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, billy).value += 1
    Start_Level()
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (billyOnWall == 0) {
        billy.vx = billyMoveSpeed * -1
    } else if (wallTileCheck("right") == 1 && billy.isHittingTile(CollisionDirection.Right)) {
        if (billyJumpOrFlingOfWall == 0) {
            billyJumpOrFlingOfWall = 1
            billy.vy = billy_wall_actions("wallFlingVY", "Up")
            billy.vx = billy_wall_actions("wallFlingVX", "Left")
            pause(200)
            while (billy.vx < 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                billy.vx += billy_wall_actions("wallFlingDecay", "Left")
                for (let index = 0; index < 2; index++) {
                    if (billy.vx < 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                        pause(100)
                    }
                    if (wallTileCheck("down") == 1 && billy.isHittingTile(CollisionDirection.Bottom) || !(billy.vx < 0) && !(controller.right.isPressed())) {
                        if (controller.left.isPressed()) {
                            billy.vx = billyMoveSpeed * -1
                        } else {
                            billy.vx = 0
                        }
                    }
                }
            }
            billyJumpOrFlingOfWall = 0
        }
    }
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    if (!(controller.left.isPressed()) && billyJumpOrFlingOfWall == 0) {
        billy.vx = 0
    }
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (!(controller.right.isPressed()) && billyJumpOrFlingOfWall == 0) {
        billy.vx = 0
    }
})
sprites.onDestroyed(SpriteKind.Player_Attack, function (sprite) {
    billyMagicBar.value += 1
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    status.spriteAttachedTo().destroy(effects.trail, 100)
    info.changeScoreBy(bugScoreGive)
})
statusbars.onZero(StatusBarKind.Health, function (status) {
    game.over(false, effects.dissolve)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (billyOnWall == 0) {
        billy.vx = billyMoveSpeed
    } else if (wallTileCheck("left") == 1 && billy.isHittingTile(CollisionDirection.Left)) {
        if (billyJumpOrFlingOfWall == 0) {
            billyJumpOrFlingOfWall = 1
            billy.vy = billy_wall_actions("wallFlingVY", "Up")
            billy.vx = billy_wall_actions("wallFlingVX", "Right")
            pause(200)
            while (billy.vx > 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                billy.vx += billy_wall_actions("wallFlingDecay", "Right")
                for (let index = 0; index < 2; index++) {
                    if (billy.vx > 0 && !(billy.isHittingTile(CollisionDirection.Bottom)) && !(controller.right.isPressed() || controller.left.isPressed())) {
                        pause(100)
                    }
                    if (wallTileCheck("down") == 1 && billy.isHittingTile(CollisionDirection.Bottom) || !(billy.vx > 0) && !(controller.left.isPressed())) {
                        if (controller.right.isPressed()) {
                            billy.vx = billyMoveSpeed
                        } else {
                            billy.vx = 0
                        }
                    }
                }
            }
            billyJumpOrFlingOfWall = 0
        }
    }
})
scene.onHitWall(SpriteKind.Player_Attack, function (sprite, location) {
    sprite.destroy(effects.disintegrate, 100)
})
function wallTileCheck (direction: string) {
    if (direction == "right") {
        if (!(billy.tileKindAt(TileDirection.Right, assets.tile`transparency16`))) {
            if (billy.tileKindAt(TileDirection.Right, assets.tile`Sign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Right, assets.tile`devNoticeSign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Right, assets.tile`exitPortalTile`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Right, assets.tile`spikeTile`)) {
                return 0
            } else {
                return 1
            }
        } else {
            return 0
        }
    } else if (direction == "left") {
        if (!(billy.tileKindAt(TileDirection.Left, assets.tile`transparency16`))) {
            if (billy.tileKindAt(TileDirection.Left, assets.tile`Sign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Left, assets.tile`devNoticeSign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Left, assets.tile`exitPortalTile`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Left, assets.tile`spikeTile`)) {
                return 0
            } else {
                return 1
            }
        } else {
            return 0
        }
    } else if (direction == "down") {
        if (!(billy.tileKindAt(TileDirection.Bottom, assets.tile`transparency16`))) {
            if (billy.tileKindAt(TileDirection.Bottom, assets.tile`Sign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Bottom, assets.tile`devNoticeSign`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Bottom, assets.tile`exitPortalTile`)) {
                return 0
            } else if (billy.tileKindAt(TileDirection.Bottom, assets.tile`spikeTile`)) {
                return 0
            } else {
                return 1
            }
        } else {
            return 0
        }
    } else {
        return 0
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Garbage, function (sprite, otherSprite) {
    bug = sprites.create(assets.image`bugPlaceHold`, SpriteKind.Enemy)
    tiles.placeOnTile(bug, tiles.getTileLocation(otherSprite.tilemapLocation().column - 3, otherSprite.tilemapLocation().row - 3))
    otherSprite.destroy()
    animation.runImageAnimation(
    bug,
    assets.animation`bug`,
    100,
    true
    )
    bugHealthBar = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
    bugHealthBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    bugHealthBar.setColor(4, 2)
    bugHealthBar.setBarBorder(1, 14)
    bugHealthBar.max = 10
    bugHealthBar.attachToSprite(bug)
})
function create_var_testing_bar () {
    varTestingBar = statusbars.create(20, 6, StatusBarKind.Magic)
    varTestingBar.setColor(7, 15)
    varTestingBar.setBarBorder(1, 1)
    varTestingBar.max = 1
}
function DevTesting (active: number, devTestingBar: number, devTestingLevel: number) {
    if (active == 1) {
        devTesting = active
        devTestBar = devTestingBar
        if (devTestBar == 1) {
            create_var_testing_bar()
        }
        devTestLevel = devTestingLevel
    } else {
        devTesting = 0
        devTestBar = 0
        devTestLevel = 0
    }
}
function billy_wall_actions (wallJumpwallFling_VXVYDecay: string, RightLeft: string) {
    wallActionsVar = 0
    if (wallJumpwallFling_VXVYDecay.includes("wallJump")) {
        if (wallJumpwallFling_VXVYDecay.includes("VX")) {
            wallActionsVar = billyMoveSpeed * 0.4
        } else if (wallJumpwallFling_VXVYDecay.includes("VY")) {
            wallActionsVar = billyJumpHeight * 0.8
        } else if (wallJumpwallFling_VXVYDecay.includes("Decay")) {
            wallActionsVar = billyMoveSpeed * -0.1
        }
    } else if (wallJumpwallFling_VXVYDecay.includes("wallFling")) {
        if (wallJumpwallFling_VXVYDecay.includes("VX")) {
            wallActionsVar = billyMoveSpeed * 1.2
        } else if (wallJumpwallFling_VXVYDecay.includes("VY")) {
            wallActionsVar = billyJumpHeight * 0.4
        } else if (wallJumpwallFling_VXVYDecay.includes("Decay")) {
            wallActionsVar = billyMoveSpeed * -0.2
        }
    } else {
        return 0
    }
    if (!(RightLeft.includes("Right"))) {
        if (RightLeft.includes("Right")) {
            wallActionsVar = wallActionsVar * 1
        } else if (RightLeft.includes("Left")) {
            wallActionsVar = wallActionsVar * -1
        }
    }
    return wallActionsVar
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fireball, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 500)
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -2
})
sprites.onOverlap(SpriteKind.Player_Attack, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy(effects.disintegrate, 100)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += billyBulletDamage
})
sprites.onCreated(SpriteKind.Player_Attack, function (sprite) {
    billyMagicBar.value += -1
    sprite.setPosition(billy.x, billy.y)
    if (billyDirectionLeft == 1) {
        sprite.image.flipX()
        sprite.setImage(sprite.image)
        sprite.vx = bulletSpeed * -1
        sprite.ax = bulletAcceleration * -1
    } else {
        sprite.vx = bulletSpeed
        sprite.ax = bulletAcceleration
    }
    timer.after(1500, function () {
        sprite.destroy(effects.disintegrate, 100)
    })
})
function set_billy_status_bars () {
    billyHealthBar = statusbars.create(20, 4, StatusBarKind.Health)
    billyHealthBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    billyHealthBar.setOffsetPadding(0, -1)
    billyHealthBar.setColor(7, 2, 3)
    billyHealthBar.setBarBorder(1, 6)
    billyHealthBar.max = billyMaxHealth
    billyHealthBar.attachToSprite(billy)
    billyEnergyBar = statusbars.create(10, 4, StatusBarKind.Energy)
    billyEnergyBar.setOffsetPadding(5, -5)
    billyEnergyBar.setColor(5, 13)
    billyEnergyBar.setBarBorder(1, 4)
    billyEnergyBar.max = billyMaxEnergy
    billyEnergyBar.attachToSprite(billy)
    billyMagicBar = statusbars.create(10, 4, StatusBarKind.Magic)
    billyMagicBar.setOffsetPadding(-5, -5)
    billyMagicBar.setColor(9, 6)
    billyMagicBar.setBarBorder(1, 8)
    billyMagicBar.max = billyMaxMagic
    billyMagicBar.attachToSprite(billy)
}
function Start_Level () {
    for (let value of sprites.allOfKind(SpriteKind.tips)) {
        value.destroy()
    }
    if (devTestLevel == 1) {
        tiles.setCurrentTilemap(tilemap`devTestingLevel`)
    } else if (devTestLevel == 2) {
        tiles.setCurrentTilemap(tilemap`level7`)
    } else if (currentLevel == 0) {
        tiles.setCurrentTilemap(tilemap`level1`)
    } else if (currentLevel == 1) {
        tiles.setCurrentTilemap(tilemap`level2`)
    } else if (currentLevel == 2) {
        tiles.setCurrentTilemap(tilemap`level3`)
    } else {
        game.over(true)
    }
    tiles.placeOnRandomTile(billy, assets.tile`playerStartPlacehold`)
    for (let value of tiles.getTilesByType(assets.tile`playerStartPlacehold`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    scene.cameraFollowSprite(billy)
    for (let value of sprites.allOfKind(SpriteKind.Player_Attack)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Coin)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Garbage)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Fireball)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Player_Attack)) {
        value.destroy()
    }
    for (let value of tiles.getTilesByType(assets.tile`coinPlacehold`)) {
        coin = sprites.create(assets.image`coin`, SpriteKind.Coin)
        animation.runImageAnimation(
        coin,
        assets.animation`coinAnimated`,
        100,
        true
        )
        tiles.placeOnTile(coin, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`enemyPlacehold`)) {
        Garbage = sprites.create(assets.image`garbage`, SpriteKind.Garbage)
        tiles.placeOnTile(Garbage, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`fireBallPlaceHold`)) {
        fireBall = sprites.create(assets.image`fireball`, SpriteKind.Fireball)
        tiles.placeOnTile(fireBall, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        animation.runMovementAnimation(
        fireBall,
        "c 0 -100 0 100 0 0",
        2000,
        true
        )
        pause(200)
        animation.runImageAnimation(
        fireBall,
        assets.animation`fireballAnimated`,
        200,
        true
        )
        fireBall.startEffect(effects.fire)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.y - otherSprite.y < 0) {
        timer.throttle("billyStompedBug", 250, function () {
            sprite.vy = billyJumpHeight * 0.75
            otherSprite.vy = billyJumpHeight * -1
            statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += billyStompDamage
        })
    } else {
        otherSprite.destroy(effects.disintegrate, 100)
        statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite).value += -1
    }
})
let fireBall: Sprite = null
let Garbage: Sprite = null
let coin: Sprite = null
let billyEnergyBar: StatusBarSprite = null
let billyHealthBar: StatusBarSprite = null
let billyDirectionLeft = 0
let wallActionsVar = 0
let devTestBar = 0
let bugHealthBar: StatusBarSprite = null
let bug: Sprite = null
let billyJumpOrFlingOfWall = 0
let billyOnWall = 0
let billyAttack: Sprite = null
let billyMagicBar: StatusBarSprite = null
let bugScoreGive = 0
let coinScoreGive = 0
let billyStompDamage = 0
let bulletAcceleration = 0
let bulletSpeed = 0
let billyBulletDamage = 0
let billyMaxMagic = 0
let billyMaxHealth = 0
let billyEnergyGain = 0
let billyEnergyDrain = 0
let billyMaxEnergy = 0
let billyJumpHeight = 0
let fallSpeed = 0
let varTestingBar: StatusBarSprite = null
let devTesting = 0
let devTestLevel = 0
let billyMoveSpeed = 0
let billy: Sprite = null
let currentLevel = 0
scene.setBackgroundColor(9)
scene.setBackgroundImage(assets.image`world1Background`)
currentLevel = 0
// var=0: var is inactive
// var=1: var is active
// 1st var: checks if dev testing is active
// 2nd var: checks if test bar is active
// 3rd var: tests if testing level is active
DevTesting(0, 0, 1)
// creates vars for controlling different aspects of the game
set_place_hold_vars()
billy = sprites.create(assets.image`billyWalk`, SpriteKind.Player)
billy.setBounceOnWall(false)
// creates the player's info bars for health, stamina, mana, Etc
set_billy_status_bars()
// creates the level
Start_Level()
game.onUpdate(function () {
    // if the dev testing bar was activated, this updates the testing bar which is used for testing weather a var is functioning properly
    Update_Test_Bar(devTestBar)
    billy.setImage(assets.image`billyWalk`)
    if (billyOnWall == 0) {
        if (billy.vy < 0) {
            billy.setImage(assets.image`billyJump`)
        } else if (billy.vy > 0) {
            billy.setImage(assets.image`billyFall`)
        } else if (billy.x % 2 < 1 && (controller.left.isPressed() || controller.right.isPressed())) {
            billy.setImage(assets.image`billyWalk1`)
        }
    }
    if (wallTileCheck("left") == 1 && billy.isHittingTile(CollisionDirection.Left) || wallTileCheck("right") == 1 && billy.isHittingTile(CollisionDirection.Right)) {
        billy.vy = 0
        billyOnWall = 1
        billy.ay = 0
        if (billyEnergyBar.value > 0) {
            billy.setImage(assets.image`billyWallGrab`)
            if (controller.down.isPressed()) {
                billy.y += 0.25
                billy.setImage(assets.image`billyWallSlide`)
            }
        } else {
            billy.setImage(assets.image`billyWallSlide`)
            if (controller.down.isPressed()) {
                billy.y += 0.75
            }
            billy.y += 0.5
        }
    } else {
        billy.ay = fallSpeed
        billyOnWall = 0
    }
    if (billy.vx < 0 || billy.isHittingTile(CollisionDirection.Left)) {
        billyDirectionLeft = 1
    } else if (billy.vx > 0 || billy.isHittingTile(CollisionDirection.Right)) {
        billyDirectionLeft = 0
    }
    if (billyDirectionLeft == 1) {
        billy.image.flipX()
        billy.setImage(billy.image)
    }
})
game.onUpdateInterval(100, function () {
    if (wallTileCheck("left") == 1 && billy.isHittingTile(CollisionDirection.Left) || wallTileCheck("right") == 1 && billy.isHittingTile(CollisionDirection.Right)) {
        if (billyEnergyBar.value > 0 && !(wallTileCheck("down") == 1 && billy.isHittingTile(CollisionDirection.Bottom))) {
            billyEnergyBar.value += billyEnergyDrain
        }
    } else {
        if (billyEnergyBar.value < billyMaxEnergy) {
            billyEnergyBar.value += billyEnergyGain
        }
    }
})
