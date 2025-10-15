import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';
import { Button, Text } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';

export function Home() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<import('@react-native-firebase/auth').FirebaseAuthTypes.User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleAuthStateChanged(user: import('@react-native-firebase/auth').FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <Button onPress={handleLogin}>Sign In</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Hello {user?.email}</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <Button screen="Profile" params={{ user: 'jane' }}>
        Go to Profile
      </Button>
      <Button screen="Settings">Go to Settings</Button>
      <Button onPress={handleLogout}>Sign out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});