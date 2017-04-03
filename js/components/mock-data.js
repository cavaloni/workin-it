import _ from 'lodash';

const mockData = {
    2017: {
        10: {
            arms: {
                pullUps: {
                    fullName: 'Pull Ups',
                    sets: 3,
                    data: [{
                        weight: 180,
                        reps: 4,
                    }, {
                        weight: 180,
                        reps: 5,
                    }, {
                        weight: 180,
                        reps: 6,
                    }],
                },
                tricepPullDown: {
                    fullName: 'Tricep Pull Down',
                    sets: 3,
                    data: [{
                        weight: 80,
                        reps: 4,
                    }],
                },
            },
            back: {
                cockPushUps: {
                    fullName: 'Cock Push Ups',
                    sets: 2,
                    data: [{
                        weight: 280,
                        reps: 1,
                    }, {
                        weight: 280,
                        reps: 2,
                    }],
                },
            },
        },
        11: {
            arms: {
                pullUps: {
                    fullName: 'Pull Ups',
                    sets: 3,
                    data: [{
                        weight: 185,
                        reps: 4,
                    }, {
                        weight: 185,
                        reps: 5,
                    }, {
                        weight: 185,
                        reps: 6,
                    }],
                },
                tricepPullDown: {
                    fullName: 'Tricep Pull Down',
                    sets: 3,
                    data: [{
                        weight: 85,
                        reps: 4,
                    }],
                },
            },
            back: {
                cockPushUps: {
                    fullName: 'Cock Push Ups',
                    sets: 2,
                    data: [{
                        weight: 280,
                        reps: 1,
                    }, {
                        weight: 280,
                        reps: 2,
                    }],
                },
            },
        },
        12: {
            arms: {
                pullUps: {
                    fullName: 'Pull Ups',
                    sets: 3,
                    data: [{
                        weight: 190,
                        reps: 4,
                    }, {
                        weight: 190,
                        reps: 5,
                    }, {
                        weight: 190,
                        reps: 6,
                    }],
                },
                tricepPullDown: {
                    fullName: 'Tricep Pull Down',
                    sets: 3,
                    data: [{
                        weight: 90,
                        reps: 4,
                    }],
                },
            },
            back: {
                cockPushUps: {
                    fullName: 'Cock Push Ups',
                    sets: 2,
                    data: [{
                        weight: 290,
                        reps: 1,
                    }, {
                        weight: 290,
                        reps: 2,
                    }],
                },
            },
        },
        13: {
            arms: {
                pullUps: {
                    fullName: 'Pull Ups',
                    sets: 3,
                    data: [{
                        weight: 200,
                        reps: 5,
                    }, {
                        weight: 200,
                        reps: 4,
                    }, {
                        weight: 200,
                        reps: 4,
                    }],
                },
                tricepPullDown: {
                    fullName: 'Tricep Pull Down',
                    sets: 3,
                    data: [{
                        weight: 100,
                        reps: 4,
                    }],
                },
            },
            back: {
                cockPushUps: {
                    fullName: 'Cock Push Ups',
                    sets: 2,
                    data: [{
                        weight: 310,
                        reps: 1,
                    }, {
                        weight: 300,
                        reps: 2,
                    }],
                },
            },
        },
    },
};

const fakePeople = [{
    name: 'Bubba Jones',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData,
},
{
    name: 'Jesus Christ',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData,
},
{
    name: 'Milford WaxPaddy',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData,
},
{
    name: 'Who Bo Fo Ducky',
    avatar: 'http://lorempixel.com/400/200',
    data: mockData,
},
];

export default mockData;
