'use client';
import {Pressable, StyleSheet, View} from 'react-native';
import {FaChevronDown, FaChevronUp} from 'react-icons/fa';
import {LyristText} from 'packages/components';
import {LYRIST_BLUE} from 'packages/constants';

export function InfoCard({
  title,
  children,
  icon,
  collapsible = false,
  isOpen = false,
  onToggle,
  variant = 'default', // 'default' | 'primary'
  style,
}) {
  const isPrimary = variant === 'primary';
  const Wrapper = collapsible ? Pressable : View;

  return (
    <Wrapper
      onPress={collapsible ? onToggle : undefined}
      style={[
        styles.container,
        isPrimary ? styles.primaryContainer : styles.defaultContainer,
        style,
      ]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <LyristText
            weight="Medium"
            style={[
              styles.title,
              isPrimary ? styles.primaryTitle : styles.defaultTitle,
              collapsible && {paddingRight: 24}, // Space for chevron
            ]}>
            {title}
          </LyristText>
          {collapsible && (
            <View style={styles.chevron}>
              {isOpen ? (
                <FaChevronUp color={isPrimary ? 'white' : 'black'} />
              ) : (
                <FaChevronDown color={isPrimary ? 'white' : 'black'} />
              )}
            </View>
          )}
        </View>
        {(!collapsible || isOpen) && (
          <View style={styles.content}>
            {typeof children === 'string' ? (
              <LyristText style={[styles.text, isPrimary && styles.primaryText]}>
                {children}
              </LyristText>
            ) : (
              children
            )}
          </View>
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  defaultContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    backgroundColor: 'white',
    borderColor: 'black',
  },
  primaryContainer: {
    backgroundColor: LYRIST_BLUE,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align top in case title wraps
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  defaultTitle: {
    color: 'black',
  },
  primaryTitle: {
    color: 'white',
    fontSize: 24, // Larger title for primary cards like "Type Beat"
  },
  chevron: {
    marginLeft: 8,
    marginTop: 4, // Align with text
  },
  content: {
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  primaryText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
  },
});
