const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require("./models/comment");

var data = [{
        name: "Salmon creek",
        image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
        description: "Lorem ipsum dolor sit amet, regione denique corpora vim id, ex sanctus ancillae mei. Id eum tantas patrioque interesset. Eos in lorem numquam indoctum, id dignissim instructior nam, nulla dicunt interesset vix ex. Ut patrioque gloriatur delicatissimi cum. Ex eam solum eleifend recteque, aeque consulatu referrentur ut sed, aliquam interpretaris vim cu Quo ea omnis harum legere, debet detraxit postulant ad nec. No libris consectetuer sea, alia adhuc voluptaria his ex. Ut per zril clita explicari, ut justo deleniti eum, ea eruditi ornatus vis. In usu petentium ocurreret efficiendi, an cum facete omnesque scripserit. Vel ad dicam dolorem disputationi, at vim illum intellegat, et minim recusabo has. Platonem neglegentur vis id."
    },
    {
        name: "Desert Mesa",
        image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
        description: "Lorem ipsum dolor sit amet, regione denique corpora vim id, ex sanctus ancillae mei. Id eum tantas patrioque interesset. Eos in lorem numquam indoctum, id dignissim instructior nam, nulla dicunt interesset vix ex. Ut patrioque gloriatur delicatissimi cum. Ex eam solum eleifend recteque, aeque consulatu referrentur ut sed, aliquam interpretaris vim cu Quo ea omnis harum legere, debet detraxit postulant ad nec. No libris consectetuer sea, alia adhuc voluptaria his ex. Ut per zril clita explicari, ut justo deleniti eum, ea eruditi ornatus vis. In usu petentium ocurreret efficiendi, an cum facete omnesque scripserit. Vel ad dicam dolorem disputationi, at vim illum intellegat, et minim recusabo has. Platonem neglegentur vis id."
    },
    {
        name: "Canyon Floor",
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
        description: "Lorem ipsum dolor sit amet, regione denique corpora vim id, ex sanctus ancillae mei. Id eum tantas patrioque interesset. Eos in lorem numquam indoctum, id dignissim instructior nam, nulla dicunt interesset vix ex. Ut patrioque gloriatur delicatissimi cum. Ex eam solum eleifend recteque, aeque consulatu referrentur ut sed, aliquam interpretaris vim cu Quo ea omnis harum legere, debet detraxit postulant ad nec. No libris consectetuer sea, alia adhuc voluptaria his ex. Ut per zril clita explicari, ut justo deleniti eum, ea eruditi ornatus vis. In usu petentium ocurreret efficiendi, an cum facete omnesque scripserit. Vel ad dicam dolorem disputationi, at vim illum intellegat, et minim recusabo has. Platonem neglegentur vis id."
    },
    {
        name: "Black & White",
        image: "https://farm4.staticflickr.com/3397/3662177625_a9c2e794be.jpg",
        description: "Lorem ipsum dolor sit amet, regione denique corpora vim id, ex sanctus ancillae mei. Id eum tantas patrioque interesset. Eos in lorem numquam indoctum, id dignissim instructior nam, nulla dicunt interesset vix ex. Ut patrioque gloriatur delicatissimi cum. Ex eam solum eleifend recteque, aeque consulatu referrentur ut sed, aliquam interpretaris vim cu Quo ea omnis harum legere, debet detraxit postulant ad nec. No libris consectetuer sea, alia adhuc voluptaria his ex. Ut per zril clita explicari, ut justo deleniti eum, ea eruditi ornatus vis. In usu petentium ocurreret efficiendi, an cum facete omnesque scripserit. Vel ad dicam dolorem disputationi, at vim illum intellegat, et minim recusabo has. Platonem neglegentur vis id."
    }

]



function seedDB() {
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);

        } else {
            console.log("Removed Campgrounds");

            // add few Campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (!err) {
                        console.log("added campground");

                        Comment.create({
                            text: "This place is great but i wish there was internet",
                            author: "Homer"
                        }, (err, comment) => {
                            if (!err){
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created a new comment");
                            } else {
                                console.log(err);
                            }
                        });


                    } else {
                        console.log(err);
                    }

                });

            });
        }

    });


}

module.exports = seedDB;