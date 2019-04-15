/**
 * Gives IFTTT a set of test data to run on our endpoints.
 * See here for info: https://platform.ifttt.com/docs/testing
 * When adding new controllers or editing old controllers,
 * please add up to date test information here.
 * Note that only controllers that have trigger fields
 * use this controller.
 */
module.exports = async function(req, res) {
  res.send({
    data: {
      samples: {
        triggers: {
          alberta_air_health_risk: {
            city: '67'
          },
          alberta_air_health_index: {
            city: '67'
          },
          open_data: {
            data_set:
              'rk7f-7aur|&|Recreational Facility -  Drop In Swim (Detail)|&|activity'
          }
        },
        triggerFieldValidations: {
          alberta_air_health_risk: {
            valid: '67',
            invalid: 'not-a-community-id'
          },
          alberta_air_health_index: {
            valid: '67',
            invalid: 'not-a-community-id'
          },
          open_data: {
            valid:
              'rk7f-7aur|&|Recreational Facility -  Drop In Swim (Detail)|&|activity',
            invalid: 'not-a-data-set'
          }
        }
      }
    }
  })
}

/**
 * "data": {
    "samples": {
      "triggers": {
        "geo_location": {
          "location": {
            "lat": "",
            "lon": "",
            "address": "",
            "description": "",
            "radius": ""
          }
        },
        "open_data_cd01961": {
          "dataset": ""
        },
        "open_data": {
          "dataset": ""
        },
        "alberta_air_health_risk": {
          "city": ""
        },
        "alberta_air_health_index": {
          "city": ""
        }
      },
      "actions": {
        "notification": {
          "notification": ""
        },
        "test": {
          "test": "",
          "test2": ""
        }
      },
      "actionRecordSkipping": {
        "notification": {
          "notification": ""
        },
        "test": {
          "test": "",
          "test2": ""
        }
      }
    }
  }
 */
