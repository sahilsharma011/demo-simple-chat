if (Meteor.isClient) {


    Template.home.events({
        'click button': function (e) {

            e.preventDefault()
            var roomId = $(e.target).val()
            var username = $("#username").val()
            if (!username) {
                if ($('.form-group').hasClass('has-error'))
                    return
                $('.form-group').addClass('has-error').append('<span class="help-block">Is required</span>')
                $('input').keyup(function () {
                    if ($(this).val() != '') {
                        $('.form-group').removeClass('has-error')
                        $('span').remove()
                    }
                })
                return
            }
            console.log(username, roomId)
            Router.go('room', {roomId: roomId}, {query: 'username=' + username})
        }
    });
    Template.home.helpers({
        'random': function () {
            return Random.id(5)
        }

    });

    Template.room.onRendered(function () {
        var self = this
        this.avatarReady = new ReactiveVar(false)
        HTTP.get('https://randomuser.me/api/', function (err, res) {
            console.log(err, res)
            if (err)
                return Session.set('avatar', "/avatar" + (Math.floor(Math.random() * 5) + 1) + ".png")

            Session.set('avatar', res.data.results[0].user.picture.thumbnail)
        })


    })

    Template.room.helpers({
        'roomId': function () {
            return Router.current().params.roomId
        },
        'username': function () {
            console.log('Router.current()', Router.current())
            return Router.current().params.query.username
        },
        avatar: function () {

            return Session.get('avatar')
        }

    });


}

Router.route("/", {
    name: "home",
    action: function () {
        this.render('home')
    }
})
Router.route("/:roomId", {
    name: "room",
    action: function () {
        this.render('room')
    }
})
