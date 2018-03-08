import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
    body: {
        flex: 1
      },
      bodyHeader: {
        fontWeight: 'bold'
      },
    coverArt: {
        width: 50,
        height: 50,
        marginRight: 10
      },
    listItem: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 10,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      itemButton: {
          backgroundColor: '#3d70b2',
      },
      itemButtonText: {
        color: '#fff',
        fontSize: 12,
        padding: 2,
        textAlign: 'center',
      }
});

export default class DuplicatedListItem extends React.Component {
    render() {
        const {imageUrl, title, subtitle, duplicates, duplicatesClick} = this.props;
        return <View style={styles.listItem}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.coverArt}
            />
            <View style={styles.body}>
                <View style={{ flexDirection: 'row'}}>
                    <View style={{flex: 1, marginBottom: 6}}>
                        <View>
                            <Text style={styles.itemTitle}>{title}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 12}}>Contains {duplicates.length} {duplicates.length > 1 ? 'duplicates' : 'duplicate'}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1/3}}>
                        <TouchableOpacity style={styles.itemButton}
                            onPress={() => this.props.duplicatesClick()}
                        >
                        <View>
                            <Text style={styles.itemButtonText}>Remove {duplicates.length} {duplicates.length > 1 ? 'duplicates' : 'duplicate'}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
            {duplicates.map((d, i) => (
                <View key={i} style={{flexDirection: 'row'}}>
                    <Text numberOfLines={1} style={{fontSize: 12}}>
                        {d.track.name}
                        <Text style={{color: '#666'}}> by </Text>
                    {d.track.artists[0].name}
                    </Text>
                </View>
            ))}
            </View>
        </View>
        </View>
    };
}
