import json
import requests
from algoliasearch import algoliasearch

global	EB_API_KEY;
global	ME_API_KEY;
global	lat;
global	lng;

EB_API_KEY = "TOECTWV4CHD4SEU3CLIH";
ME_API_KEY = "504b155a2d4b54566a2b393270736b24";

lat = "44.8404400";
lng = "-0.5805000";

def get_eb_geoloc(id):

	ret = dict();
	req = "https://www.eventbriteapi.com/v3/venues/" + str(id) + "/?token=" + EB_API_KEY
	res = requests.get(req);
	if (res.status_code == 200):
		ret['lng'] = float(res.json()['address']['longitude']);
		ret['lat'] = float(res.json()['address']['latitude']);
	return (ret);

def get_eb_cost(id):

	ret = dict();
	req = "https://www.eventbriteapi.com/v3/events/" + str(id) + "/ticket_classes/?token=" + EB_API_KEY
	res = requests.get(req);
	if (res.status_code == 200):
		for key in res.json()['ticket_classes']:
			if ('cost' in key):
				ret[key['cost']['value']] =\
				{
					'display' : key['cost']['display'],
					'value' : key['cost']['value'],
				};
	return (ret);

def get_eb_events():

	ret = list();
	req = "https://www.eventbriteapi.com/v3/events/search/?location.latitude=" + lat + "&location.longitude=" + lng + "&token=" + EB_API_KEY
	res = requests.get(req);
	if (res.status_code == 200):
		for key in res.json()['events']:
			ret.append(
			{
				'id' : key['id'],
				'name' : key['name']['text'],
				'description' : key['description']['text'],
				'url' : key['url'],
				'price' : get_eb_cost(key['id']),
				'_geoloc' : get_eb_geoloc(key['venue_id'])
			});
	return (ret);

def get_meet_price(key):

	if ('fee' in key):
            ret = dict(value = key['fee']['amount'], display = str(key['fee']['amount']) + ' ' + key['fee']['currency']);
	else:
		ret = dict(value = 0, display = '0 €');
	return (ret);

def get_meet_events(array):

	req = "https://api.meetup.com/find/events?&sign=true&photo-host=public&lon=" + lng + "&lat=" + lat + "&key=" + ME_API_KEY
	res = requests.get(req);
	for key in res.json():
		if ('venue' in key):
			array.append(
			{
				'id' : key['id'],
				'name' : key['name'],
				'description' : key['description'] if ('description' in key) else "",
				'url' : key['link'],
				'price' : get_meet_price(key),
				'_geoloc' : {'lng' : float(key['venue']['lon']), 'lat' : float(key['venue']['lat'])}
			});
	return (array);

def main():

	ret = get_eb_events();
	array = get_meet_events(ret);

	# Initialize API Client & Index
	client = algoliasearch.Client('4X7CFUTU6C', '6604bab18cba2dfba9f086387679dba3');
	index = client.init_index('Hackathon');
	index.add_objects(array);

if __name__ == '__main__':
	main()


"""

EVENT BRITE

{u'changed': u'2017-04-29T15:04:33Z', 
	u'locale': u'en_US', 
	u'subcategory_id': u'1001', 
	u'currency': u'EUR', 
	u'logo': {u'edge_color_set': True, 
	u'edge_color': u'#171721', 
	u'url': u'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30899721%2F167033075804%2F1%2Foriginal.jpg?h=200&w=450&rect=24%2C0%2C922%2C461&s=08fe218ae0b00bb7ad2f95efebd0da8b', 
	u'id': u'30899721', 
	u'crop_mask': {u'width': 922, 
	u'height': 461, 
	u'top_left': {u'y': 0, 
	u'x': 24}}, 
	u'aspect_ratio': u'2', 
	u'original': {u'url': u'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30899721%2F167033075804%2F1%2Foriginal.jpg?s=9acb3e7189307ca45b71057b115b764a', 
	u'width': 1117, 
	u'height': 461}}, 
	u'id': u'34163679485', 
	u'privacy_setting': u'unlocked', 
	u'venue_id': u'19408945', 
	u'end': {u'timezone': u'Europe/Paris', 
	u'local': u'2017-05-11T10:30:00', 
	u'utc': u'2017-05-11T08:30:00Z'}, 
	u'source': u'create_2.0', 
	u'capacity_is_custom': True, 
	u'logo_id': u'30899721', 
	u'start': {u'timezone': u'Europe/Paris', 
	u'local': u'2017-05-11T09:00:00', 
	u'utc': u'2017-05-11T07:00:00Z'}, 
	u'version': u'3.0.0', 
	u'listed': True, 
	u'hide_end_date': False, 
	u'status': u'live', 
	u'description': {u'text': u"Les \xe9quipes de Happy Capital et Auris vous convient \xe0 participer \xe0 un petit-d\xe9jeuner le 11 mai prochain \xe0 la Chambre de Commerce et d'Industrie de Bordeaux (salle Jean Jaur\xe8s).\nAu programme :\n- Pr\xe9sentation de la soci\xe9t\xe9 Auris, le sp\xe9cialiste incontest\xe9 de la th\xe9rapie magn\xe9tique, son activit\xe9, ses projets de d\xe9veloppement...\n- Pr\xe9sentation de la plateforme Happy Capital\n- Questions/r\xe9ponses avec les dirigeants d'Auris\n- Temps d'\xe9change\n*** Inscription gratuite ***", 
	u'html': u"<P>Les \xe9quipes de Happy Capital et Auris vous convient \xe0 participer \xe0 un petit-d\xe9jeuner le 11 mai prochain \xe0 la Chambre de Commerce et d'Industrie de Bordeaux (salle Jean Jaur\xe8s).</P>\n<P>Au programme :</P>\n<P>- Pr\xe9sentation de la soci\xe9t\xe9 Auris, le sp\xe9cialiste incontest\xe9 de la th\xe9rapie magn\xe9tique, son activit\xe9, ses projets de d\xe9veloppement...<BR></P>\n<P>- Pr\xe9sentation de la plateforme Happy Capital</P>\n<P>- Questions/r\xe9ponses avec les dirigeants d'Auris</P>\n<P>- Temps d'\xe9change</P>\n<P>*** Inscription gratuite ***</P>"}, 
	u'is_free': True, 
	u'is_series_parent': False, 
	u'capacity': 60, 
	u'format_id': u'2', 
	u'organizer_id': u'13675751809', 
	u'name': {u'text': u"Petit-d\xe9jeuner avec l'\xe9quipe d'AURIS \xe0 la CCI de Bordeaux.", 
	u'html': u'Petit-d\xe9jeuner avec l&#39;\xe9quipe d&#39;AURIS \xe0 la CCI de Bordeaux.'}, 
	u'created': u'2017-04-29T14:55:41Z', 
	u'is_locked': False, 
	u'hide_start_date': False, 
	u'url': u'https://www.eventbrite.com/e/petit-dejeuner-avec-lequipe-dauris-a-la-cci-de-bordeaux-tickets-34163679485?aff=ebapi', 
	u'shareable': True, 
	u'tx_time_limit': 480, 
	u'online_event': False, 
	u'is_series': False, 
	u'category_id': u'101', 
	u'is_reserved_seating': False, 
	u'resource_uri': u'https://www.eventbriteapi.com/v3/events/34163679485/'}


	"""
