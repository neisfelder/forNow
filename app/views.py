from flask import Flask
from flask import render_template
from flask import request
import json

app = Flask(__name__)
#app.config.from_object('config')

#from app import views, models


# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
# db = SQLAlchemy(app)
#
#
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True)
#     email = db.Column(db.String(120), unique=True)
#
#     def __init__(self, username, email):
#         self.username = username
#         self.email = email
#
#     def __repr__(self):
#         return '<User %r>' % self.username

@app.route('/')
def index():
    user = {'nickname': 'Noah'}  # fake user
    items = [  # fake array of posts            # EVENTUALLY WILL PULL FROM DATABASE
        {
            'name': {'nickname': 'John'},
            'lists':
                {
                    'all':
                        [
                            {'listname': 'chores', 'strippedname': 'chores', 'tasks': [
                                {'task': 'clean stuff', 'strippedtask': 'clean_stuff-choresUL', 'selected': 'yes'},
                                {'task': 'clean more stuff', 'strippedtask': 'clean_more_stuff-choresUL', 'selected': 'yes'}]
                            },
                            {'listname': 'school', 'strippedname': 'school', 'tasks': [
                                {'task': 'school asmt 1', 'strippedtask': 'school_asmt_1-schoolUL', 'selected': 'yes'},
                                {'task': 'school asmt 2', 'strippedtask': 'school_asmt_2-schoolUL', 'selected': 'no'}]
                            },

                        ]
                }
        }
    ]
    listitemslist = items[0]['lists']['all']
    return render_template('listpage.html',
                           title='Home',
                           user=user,
                           listitems=listitemslist)



@app.route('/_upload/', methods=['GET','POST'])
def saving():

    data = json.dumps(request.get_json())
    dataJSON = json.loads(data)

    name = dataJSON['name']['nickname']
    print ('name:')
    print(name)


    return render_template('list_db.json',
                           title='Home',
                           json=dataJSON)


# @app.route('/user_database')
# def database():
#     return render_template('list_db.json', )


if __name__ == "__main__":
    app.run(debug=True)

