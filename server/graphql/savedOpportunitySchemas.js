var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var GraphQLDate = require("graphql-date");
var SavedOpportunityModel = require("../models/SavedOpportunity");

var savedOpportunityType = new GraphQLObjectType({
  name: "savedOpportunity",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      id_user: {
        type: GraphQLString,
      },
      id_opportunity: {
        type: GraphQLString,
      },
      comment: {
        type: GraphQLString,
      },
      updated_date: {
        type: GraphQLDate,
      },
    };
  },
});

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      savedOpportunities: {
        type: new GraphQLList(savedOpportunityType),
        resolve: function () {
          const savedOpportunities = SavedOpportunityModel.find().exec();
          if (!savedOpportunities) {
            throw new Error("Error");
          }
          return savedOpportunities;
        },
      },
      savedOpportunity: {
        type: savedOpportunityType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const savedOpportunityDetails = SavedOpportunityModel.findById(
            params.id
          ).exec();
          if (!savedOpportunityDetails) {
            throw new Error("Error");
          }
          return savedOpportunityDetails;
        },
      },
    };
  },
});

var mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      addSavedOpportunity: {
        type: savedOpportunityType,
        args: {
          id_user: {
            type: new GraphQLNonNull(GraphQLString),
          },
          id_opportunity: {
            type: new GraphQLNonNull(GraphQLString),
          },
          comment: {
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const savedOpportunityModel = new SavedOpportunityModel(params);
          const newSavedOpportunity = savedOpportunityModel.save();
          if (!newSavedOpportunity) {
            throw new Error("Error");
          }
          return newSavedOpportunity;
        },
      },
      updateSavedOpportunity: {
        type: savedOpportunityType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
          id_user: {
            type: new GraphQLNonNull(GraphQLString),
          },
          id_opportunity: {
            type: new GraphQLNonNull(GraphQLString),
          },
          comment: {
            type: GraphQLString,
          },
        },
        resolve(root, params) {
          return SavedOpportunityModel.findByIdAndUpdate(
            params.id,
            {
              id_user: params.id_user,
              id_opportunity: params.id_opportunity,
              comment: params.comment,
              updated_date: new Date(),
            },
            function (err) {
              if (err) return next(err);
            }
          );
        },
      },
      removeSavedOpportunity: {
        type: savedOpportunityType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(root, params) {
          const remSavedOpportunity = SavedOpportunityModel.findByIdAndRemove(
            params.id
          ).exec();
          if (!remSavedOpportunity) {
            throw new Error("Error");
          }
          return remSavedOpportunity;
        },
      },
    };
  },
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
